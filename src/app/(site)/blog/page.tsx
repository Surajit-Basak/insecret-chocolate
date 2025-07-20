import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";


export default async function BlogPage() {
  const supabase = createSupabaseServerClient();
  const { data: blogPosts } = await supabase.from('blog_posts').select('*');

  // Basic function to strip HTML for plain text summary
  const getSummary = (htmlContent: string | null) => {
    if (!htmlContent) return '';
    return htmlContent.replace(/<[^>]*>/g, '').substring(0, 150);
  }
    
  return (
    <main>
      <section className="py-20 text-center bg-primary text-white">
          <h1 className="text-5xl font-headline">From Our Kitchen</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">Stories, tips, and inspiration from the world of fine chocolate.</p>
      </section>
      <section className="py-24">
          <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts?.map(post => (
                  <Card key={post.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group border-none rounded-button">
                      <CardHeader className="p-0">
                          <div className="aspect-video relative overflow-hidden">
                          <Image 
                              src={post.image_url ?? 'https://placehold.co/600x400.png'}
                              alt={post.title} 
                              width={600}
                              height={400}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          </div>
                      </CardHeader>
                      <CardContent className="p-6">
                          <p className="text-accent font-body text-sm mb-2">{post.category}</p>
                          <CardTitle className="font-headline text-xl mb-2">{post.title}</CardTitle>
                          <CardDescription className="font-body text-muted-foreground mb-4 line-clamp-3">
                              {getSummary(post.content)}...
                          </CardDescription>
                          <Button variant="link" asChild className="p-0 h-auto font-body">
                              <Link href={`/blog/${post.slug}`}>Read More</Link>
                          </Button>
                      </CardContent>
                  </Card>
              ))}
              </div>
          </div>
      </section>
    </main>
  );
}
