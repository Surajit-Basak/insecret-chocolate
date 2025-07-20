
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Trash } from "lucide-react"
import { revalidatePathsAction } from "../actions"

const testimonialFormSchema = z.object({
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  author_name: z.string().min(2, "Author name must be at least 2 characters."),
  author_role: z.string().optional(),
})

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>

interface TestimonialFormProps {
  testimonial?: TestimonialFormValues & { id: string };
}

export default function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createSupabaseBrowserClient()
  
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: testimonial || {
      quote: "",
      author_name: "",
      author_role: "",
    },
  })

  const onSubmit = async (data: TestimonialFormValues) => {
    try {
      if (testimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(data)
          .eq('id', testimonial.id)
        if (error) throw error
        toast({ title: "Success", description: "Testimonial updated successfully." })
      } else {
        const { error } = await supabase.from('testimonials').insert([data])
        if (error) throw error
        toast({ title: "Success", description: "Testimonial created successfully." })
      }
      
      await revalidatePathsAction(['/']);
      router.push('/admin/testimonials');
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
    if (!testimonial) return;
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
        const { error } = await supabase.from('testimonials').delete().eq('id', testimonial.id);
        if (error) throw error;
        toast({ title: "Success", description: "Testimonial deleted successfully." });
        await revalidatePathsAction(['/']);
        router.push('/admin/testimonials');
        router.refresh();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error deleting testimonial",
            description: error.message,
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="quote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="An absolutely divine experience..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author Name</FormLabel>
              <FormControl>
                <Input placeholder="Priya Sharma" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author_role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author Role</FormLabel>
              <FormControl>
                <Input placeholder="Food Critic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            {testimonial && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                    <Trash className="mr-2 h-4 w-4" /> Delete Testimonial
                </Button>
            )}
        </div>
      </form>
    </Form>
  )
}
