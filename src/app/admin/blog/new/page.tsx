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
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NewBlogPostPage() {
    const supabase = createSupabaseServerClient();
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
                    New Blog Post
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Post</CardTitle>
                    <CardDescription>
                        Fill out the form to add a new article to your blog.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <BlogPostForm categories={categories} />
                </CardContent>
            </Card>
        </div>
    );
}
