
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ClickableRow from "../_components/ClickableRow";
import EditButton from "../_components/EditButton";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const supabase = createSupabaseServerClient();
    const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg font-semibold md:text-xl">Products</h1>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> 
                        <span>Add Product</span>
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Your Products</CardTitle>
                    <CardDescription>Manage your chocolate products.</CardDescription>
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
                                    <TableHead className="hidden md:table-cell">Badge</TableHead>
                                    <TableHead className="hidden md:table-cell">Price</TableHead>
                                    <TableHead className="hidden md:table-cell">Best Seller</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products?.map((product) => (
                                    <ClickableRow key={product.id} href={`/admin/products/${product.slug}`}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Image
                                                alt={product.title}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={product.image_url || "https://placehold.co/64x64.png"}
                                                width="64"
                                                data-ai-hint={product.ai_hint ?? ''}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{product.title}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {product.badge && <Badge variant="outline">{product.badge}</Badge>}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">₹{product.price}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {product.is_best_seller ? "Yes" : "No"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <EditButton href={`/admin/products/${product.slug}`} />
                                        </TableCell>
                                    </ClickableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {products?.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No products yet. Start by creating one.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
