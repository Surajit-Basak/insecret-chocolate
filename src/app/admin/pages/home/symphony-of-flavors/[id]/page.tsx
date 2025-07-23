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
import SymphonyOfFlavorsForm from "../_components/SymphonyOfFlavorsForm";

export const dynamic = 'force-dynamic';

export default async function EditSymphonyOfFlavorsPage({ params }: { params: { id: string } }) {
    const supabase = createSupabaseServerClient();
    const { data: item } = await supabase
        .from('symphony_of_flavors')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!item) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon" className="h-7 w-7">
                    <Link href="/admin/pages/home/symphony-of-flavors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold md:text-xl flex-1 shrink-0 whitespace-nowrap">
                    Edit Flavor Item
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{`Editing: ${item?.title}`}</CardTitle>
                    <CardDescription>
                        {`Update the details for "${item?.title}".`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SymphonyOfFlavorsForm item={item} />
                </CardContent>
            </Card>
        </div>
    );
}
