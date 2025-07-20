
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MediaForm from "../../_components/MediaForm";

export const dynamic = 'force-dynamic';

export default async function EditMediaPage({ params }: { params: { id: string } }) {
    const supabase = createSupabaseServerClient();
    
    const { data: mediaItem } = await supabase
        .from('media')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!mediaItem) {
      notFound();
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className="flex flex-col sm:gap-4 sm:py-4">
                <div className="flex items-center gap-4 mb-4">
                    <Button asChild variant="outline" size="icon" className="h-7 w-7">
                        <Link href="/admin/media">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Edit Media Item
                    </h1>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>{`Editing: ${mediaItem?.name}`}</CardTitle>
                        <CardDescription>
                            {`Update the details for "${mediaItem?.name}".`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MediaForm mediaItem={mediaItem} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
