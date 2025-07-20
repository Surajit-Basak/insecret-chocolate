
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductEnquiryDialog from "../_components/ProductEnquiryDialog";
import ProductImageGallery from "../_components/ProductImageGallery";
import { type ProductWithImages } from "@/lib/types";

export const dynamic = 'force-dynamic';

type Props = {
  params: { slug: string }
}

// Fetch product with a no-store cache policy to ensure fresh data
async function getProduct(slug: string): Promise<ProductWithImages | null> {
    const supabase = createSupabaseServerClient();
    const { data: product } = await supabase
        .from('products')
        .select(`
            *,
            product_images (
                media_id,
                display_order,
                media (
                    id,
                    url,
                    alt_text
                )
            )
        `)
        .eq('slug', slug)
        .single();
    
    return product as ProductWithImages | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const supabase = createSupabaseServerClient();
  const { data: siteSettings } = await supabase.from('site_settings').select('key, value').eq('key', 'site_name');
  const siteName = siteSettings?.find(s => s.key === 'site_name')?.value || 'InSecret';

  const title = product.meta_title || product.title;
  const description = product.meta_description || product.title;

  return {
    title: `${title} | ${siteName}`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug);

    if (!product) {
        notFound();
    }
    
    const mainImage = { url: product.image_url ?? 'https://placehold.co/800x1000.png', alt: product.title };
    
    const galleryImages = (product.product_images || [])
        .sort((a,b) => a.display_order - b.display_order)
        .map(img => ({ url: img.media.url, alt: img.media.alt_text || product.title }));

    const allImages = [mainImage, ...galleryImages];

    return (
      <main className="py-12 md:py-24">
          <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
                  
                  <ProductImageGallery images={allImages} badge={product.badge} />

                  <div className="sticky top-28">
                      <div className="flex flex-col gap-4">
                        {product.category && <p className="text-accent font-body text-sm uppercase tracking-widest">{product.category}</p>}
                        <h1 className="text-4xl md:text-5xl font-headline mb-2">{product.title}</h1>
                        <p className="font-headline text-3xl text-primary">₹{product.price}</p>
                        
                        <article 
                            className="prose max-w-none font-body text-muted-foreground leading-relaxed mt-4"
                            dangerouslySetInnerHTML={{ __html: product.description || '' }}
                        />

                        <div className="mt-8">
                            <ProductEnquiryDialog product={product} />
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      </main>
    );
}
