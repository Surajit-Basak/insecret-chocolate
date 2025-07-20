'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { type Category } from "@/lib/types";

export default function CategoryActions({ category }: { category: Category }) {
    const supabase = createSupabaseBrowserClient();
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete the "${category.name}" category? This cannot be undone.`)) return;

        try {
            const { error } = await supabase.from('categories').delete().eq('id', category.id);
            if (error) throw error;
            toast({ title: "Success", description: "Category deleted successfully." });
            router.refresh();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error deleting category",
                description: error.message,
            });
        }
    };
    
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
            aria-haspopup="true"
            size="icon"
            variant="ghost"
            >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
                <Link href={`/admin/categories/${category.id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
