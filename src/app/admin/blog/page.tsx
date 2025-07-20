
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ClickableRow from "../_components/ClickableRow";
import EditButton from "../_components/EditButton";

export const dynamic = 'force-dynamic';

export default async function BlogPostsPage() {
    const supabase = createSupabaseServerClient();
    const { data: posts } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg font-semibold md:text-xl">Blog Posts</h1>
                <Button asChild>
                    <Link href="/admin/blog/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> 
                        <span>Add Post</span>
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Articles</CardTitle>
                    <CardDescription>Manage your blog articles.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden w-[100px] sm:table-cell">
                                        <span className="sr-only">Image</span>
                                    </TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden md:table-cell">Category</TableHead>
                                    <TableHead className="hidden md:table-cell">Created At</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts?.map((post) => (
                                    <ClickableRow key={post.id} href={`/admin/blog/${post.slug}`}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Image
                                                alt={post.title}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={post.image_url || "https://placehold.co/64x64.png"}
                                                width="64"
                                                data-ai-hint={post.ai_hint ?? ''}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{post.title}</TableCell>
                                        <TableCell className="hidden md:table-cell">{post.category}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                           <EditButton href={`/admin/blog/${post.slug}`} />
                                        </TableCell>
                                    </ClickableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {posts?.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No blog posts yet. Start by creating one.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
