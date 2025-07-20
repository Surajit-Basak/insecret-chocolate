
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
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
import CategoryForm from "../_components/CategoryForm";

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
    const supabase = createSupabaseServerClient();
    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!category) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4">
                 <Button asChild variant="outline" size="icon" className="h-7 w-7">
                    <Link href="/admin/categories">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold md:text-xl flex-1 shrink-0 whitespace-nowrap">
                    Edit Category
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Editing: {category.name}</CardTitle>
                    <CardDescription>
                        Update the details for this category.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CategoryForm category={category} />
                </CardContent>
            </Card>
        </div>
    );
}
