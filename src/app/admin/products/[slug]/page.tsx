
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductForm from "../../_components/ProductForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { slug: string } }) {
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
                  alt_text,
                  name
              )
          )
        `)
        .eq('slug', params.slug)
        .single();

    if (!product) {
      notFound();
    }

    const { data: categoriesData } = await supabase.from('categories').select('name').eq('type', 'product');
    const categories = categoriesData?.map(c => c.name) || [];

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon" className="h-7 w-7">
                    <Link href="/admin/products">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold md:text-xl flex-1 shrink-0 whitespace-nowrap">
                    Edit Product
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{`Editing: ${product?.title}`}</CardTitle>
                    <CardDescription>
                        {`Update the details for "${product?.title}".`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm product={product} categories={categories} />
                </CardContent>
            </Card>
        </div>
    );
}
