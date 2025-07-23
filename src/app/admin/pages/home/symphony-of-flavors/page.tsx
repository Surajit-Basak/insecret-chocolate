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
import ClickableRow from "../../../_components/ClickableRow";
import EditButton from "../../../_components/EditButton";

export const dynamic = 'force-dynamic';

export default async function SymphonyOfFlavorsPage() {
    const supabase = createSupabaseServerClient();
    const { data: flavors } = await supabase.from('symphony_of_flavors').select('*').order('display_order');

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg font-semibold md:text-xl">Symphony of Flavors</h1>
                <Button asChild>
                    <Link href="/admin/pages/home/symphony-of-flavors/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> 
                        <span>Add Flavor Item</span>
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Flavor Items</CardTitle>
                    <CardDescription>Add, edit, or delete items in the Symphony of Flavors section.</CardDescription>
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
                                    <TableHead>Description</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {flavors?.map((item) => (
                                    <ClickableRow key={item.id} href={`/admin/pages/home/symphony-of-flavors/${item.id}`}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Image
                                                alt={item.title}
                                                className="aspect-square rounded-md object-cover"
                                                height="64"
                                                src={item.image_url || "https://placehold.co/64x64.png"}
                                                width="64"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.display_order}</TableCell>
                                        <TableCell className="text-right">
                                           <EditButton href={`/admin/pages/home/symphony-of-flavors/${item.id}`} />
                                        </TableCell>
                                    </ClickableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {flavors?.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No flavor items yet.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
