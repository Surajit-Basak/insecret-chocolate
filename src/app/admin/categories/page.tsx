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
import CategoryActions from "./_components/CategoryActions";

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const supabase = createSupabaseServerClient();
    const { data: categories } = await supabase.from('categories').select('*').order('type').order('name');

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg font-semibold md:text-xl">Categories</h1>
                <Button asChild>
                    <Link href="/admin/categories/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> 
                        <span>Add Category</span>
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Categories</CardTitle>
                    <CardDescription>Add, edit, or delete categories for products and blog posts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="hidden md:table-cell">Created At</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories?.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell className="capitalize">{category.type}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {new Date(category.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                           <CategoryActions category={category} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {categories?.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No categories yet. Start by creating one.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
