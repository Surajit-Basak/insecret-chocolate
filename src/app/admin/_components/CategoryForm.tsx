
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
import { type Category } from "@/lib/types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { revalidatePathsAction } from "../actions"

const categoryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  type: z.enum(["product", "blog"], { required_error: "You must select a category type." }),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface CategoryFormProps {
  category?: Category;
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createSupabaseBrowserClient()
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: category || {
      name: "",
      type: "product",
    },
  })

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (category) {
        const { error } = await supabase
          .from('categories')
          .update(data)
          .eq('id', category.id)
        if (error) {
            if (error.code === '23505') {
                 toast({
                    variant: "destructive",
                    title: "Category already exists",
                    description: "A category with this name and type already exists.",
                });
                return;
            }
            throw error;
        }
        toast({ title: "Success", description: "Category updated successfully." })
      } else {
        const { error } = await supabase.from('categories').insert([data])
        if (error) {
             if (error.code === '23505') {
                 toast({
                    variant: "destructive",
                    title: "Category already exists",
                    description: "A category with this name and type already exists.",
                });
                return;
            }
            throw error;
        }
        toast({ title: "Success", description: "Category created successfully." })
      }
      await revalidatePathsAction(['/shop', '/blog']);
      router.push('/admin/categories')
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    }
  }

  const handleDelete = async () => {
    if (!category) return;
    if (!confirm(`Are you sure you want to delete the "${category.name}" category?`)) return;
    try {
        const { error } = await supabase.from('categories').delete().eq('id', category.id);
        if (error) throw error;
        toast({ title: "Success", description: "Category deleted successfully." });
        await revalidatePathsAction(['/shop', '/blog']);
        router.push('/admin/categories');
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Truffles" {...field} />
              </FormControl>
              <FormDescription>
                Must be unique for the selected type (product or blog).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Category Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="product" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Product
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="blog" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Blog
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            {category && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                    <Trash className="mr-2 h-4 w-4" /> Delete Category
                </Button>
            )}
        </div>
      </form>
    </Form>
  )
}
