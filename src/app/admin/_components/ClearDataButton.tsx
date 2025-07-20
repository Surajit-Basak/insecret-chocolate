'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ClearDataButton() {
    const { toast } = useToast();
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const handleClearData = async () => {
        if (!confirm("Are you sure you want to delete ALL sample data? This action cannot be undone.")) {
            return;
        }

        try {
            // In a real RPC function, you might do this in a transaction
            const { error: productsError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            if (productsError) throw productsError;
            
            const { error: blogError } = await supabase.from('blog_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            if (blogError) throw blogError;

            const { error: testimonialsError } = await supabase.from('testimonials').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            if (testimonialsError) throw testimonialsError;
            
            toast({
                title: "Success",
                description: "All sample data has been cleared.",
            });
            router.refresh();

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error clearing data",
                description: error.message,
            });
        }
    };

    return (
        <Button variant="destructive" onClick={handleClearData}>
            Clear Sample Data
        </Button>
    )
}
