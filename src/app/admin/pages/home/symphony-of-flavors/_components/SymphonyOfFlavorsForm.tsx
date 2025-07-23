'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Trash } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { revalidatePathsAction } from "@/app/admin/actions"
import { type SymphonyOfFlavor } from "@/lib/types"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().optional(),
  image_url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  display_order: z.coerce.number().int().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface SymphonyOfFlavorsFormProps {
  item?: SymphonyOfFlavor;
}

export default function SymphonyOfFlavorsForm({ item }: SymphonyOfFlavorsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createSupabaseBrowserClient()
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: item || {
      title: "",
      description: "",
      image_url: "",
      display_order: 0,
    },
  })
  
  const onSubmit = async (data: FormValues) => {
    try {
      if (item) {
        // Update existing item
        const { error } = await supabase
          .from('symphony_of_flavors')
          .update(data)
          .eq('id', item.id)
        if (error) throw error;
        toast({ title: "Success", description: "Item updated successfully." });
      } else {
        // Create new item
        const { error } = await supabase.from('symphony_of_flavors').insert([data]);
        if (error) throw error;
        toast({ title: "Success", description: "Item created successfully." });
      }
      await revalidatePathsAction(['/']);
      router.push('/admin/pages/home/symphony-of-flavors');
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    }
  }

  const handleDelete = async () => {
    if (!item) return;
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
        const { error } = await supabase.from('symphony_of_flavors').delete().eq('id', item.id);
        if (error) throw error;
        toast({ title: "Success", description: "Item deleted successfully." });
        await revalidatePathsAction(['/']);
        router.push('/admin/pages/home/symphony-of-flavors');
        router.refresh();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error deleting item",
            description: error.message,
        });
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Dark Chocolate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A short description of the flavor." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/600x800.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="display_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>The order in which to display the item (lower numbers first).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between pt-4 border-t">
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            {item && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                    <Trash className="mr-2 h-4 w-4" /> Delete Item
                </Button>
            )}
        </div>
      </form>
    </Form>
  )
}
