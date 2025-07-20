
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TestimonialForm from "../../_components/TestimonialForm";
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

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
    const supabase = createSupabaseServerClient();
    
    const { data: testimonial } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', params.id)
        .single();

    if (!testimonial) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4">
                 <Button asChild variant="outline" size="icon" className="h-7 w-7">
                    <Link href="/admin/testimonials">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="text-lg font-semibold md:text-xl flex-1 shrink-0 whitespace-nowrap">
                    Edit Testimonial
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Editing Testimonial</CardTitle>
                    <CardDescription>
                        {`Update the testimonial from "${testimonial?.author_name}".`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TestimonialForm testimonial={testimonial} />
                </CardContent>
            </Card>
        </div>
    );
}
