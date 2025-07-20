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
import TestimonialActions from "../_components/TestimonialActions";

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
    const supabase = createSupabaseServerClient();
    const { data: testimonials } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg font-semibold md:text-xl">Testimonials</h1>
                <Button asChild>
                    <Link href="/admin/testimonials/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> 
                        <span>Add Testimonial</span>
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>Manage your customer testimonials.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-2/5">Quote</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead className="hidden md:table-cell">Role</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {testimonials?.map((testimonial) => (
                                    <TableRow key={testimonial.id}>
                                        <TableCell className="font-medium">"{testimonial.quote}"</TableCell>
                                        <TableCell>{testimonial.author_name}</TableCell>
                                        <TableCell className="hidden md:table-cell">{testimonial.author_role}</TableCell>
                                        <TableCell className="text-right">
                                            <TestimonialActions testimonial={testimonial} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {testimonials?.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No testimonials yet. Start by adding one.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
