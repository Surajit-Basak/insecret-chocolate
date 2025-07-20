
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlogPostForm from "../../_components/BlogPostForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function EditBlogPostPage({ params }: { params: { slug: string } }) {
    const supabase = createSupabaseServerClient();

    const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!post) {
        notFound();
    }

    const { data: categoriesData } = await supabase.from('categories').select('name').eq('type', 'blog');
    const categories = categoriesData?.map(c => c.name) || [];

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon" className="h-7 w-7">
                    <Link href="/admin/blog">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold md:text-xl flex-1 shrink-0 whitespace-nowrap">
                    Edit Blog Post
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{`Editing: ${post?.title}`}</CardTitle>
                    <CardDescription>
                        {`Update the details for "${post?.title}".`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <BlogPostForm post={post} categories={categories} />
                </CardContent>
            </Card>
        </div>
    );
}
