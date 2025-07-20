
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { type BlogPost } from "@/lib/types";

export const dynamic = 'force-dynamic';

type Props = {
  params: { slug: string }
}

async function getPost(slug: string): Promise<BlogPost | null> {
    const supabase = createSupabaseServerClient();
    const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
    return post;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const supabase = createSupabaseServerClient();
  const { data: siteSettings } = await supabase.from('site_settings').select('key, value').eq('key', 'site_name');
  const siteName = siteSettings?.find(s => s.key === 'site_name')?.value || 'InSecret';

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.title;

  return {
    title: `${title} | ${siteName}`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
      <main>
          <section className="py-12 md:py-24">
              <div className="container mx-auto px-6 max-w-4xl">
                  <div className="mb-8">
                      {post.category && <p className="text-accent font-body text-sm mb-2">{post.category}</p>}
                      <h1 className="text-4xl md:text-5xl font-headline mb-4">{post.title}</h1>
                      <p className="text-muted-foreground text-lg">
                          Posted on {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                  </div>

                  <div className="aspect-video relative overflow-hidden rounded-lg mb-12">
                      <Image
                          src={post.image_url ?? 'https://placehold.co/1200x675.png'}
                          alt={post.title}
                          fill
                          className="object-cover"
                      />
                  </div>

                  <article 
                      className="prose lg:prose-xl max-w-none font-body text-foreground/80 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: post.content || '' }}
                  />
              </div>
          </section>
      </main>
    );
}
