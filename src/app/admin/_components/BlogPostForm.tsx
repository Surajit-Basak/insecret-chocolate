
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
import RichTextEditor from "./RichTextEditor"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

const blogPostFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  content: z.string().optional(),
  image_url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  category: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  ai_hint: z.string().optional(),
})

type BlogPostFormValues = z.infer<typeof blogPostFormSchema>

interface BlogPostFormProps {
  post?: BlogPostFormValues & { id: string };
  categories: string[];
}

export default function BlogPostForm({ post, categories }: BlogPostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createSupabaseBrowserClient()
  
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: post || {
      title: "",
      slug: "",
      content: "",
      image_url: "",
      category: "",
      meta_title: "",
      meta_description: "",
      ai_hint: "",
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    if (!form.formState.dirtyFields.slug) {
      form.setValue('slug', slugify(title));
    }
    if (!form.formState.dirtyFields.meta_title) {
        form.setValue('meta_title', title);
    }
  }
  
  const onSubmit = async (data: BlogPostFormValues) => {
    try {
      if (post) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(data)
          .eq('id', post.id)
        if (error) throw error;
        toast({ title: "Success", description: "Blog post updated successfully." });
        router.refresh();

      } else {
        // Create new post
        const { data: newPost, error } = await supabase.from('blog_posts').insert([data]).select().single();
        if (error) {
             if (error.code === '23505') {
                toast({
                    variant: "destructive",
                    title: "Slug already exists",
                    description: "Please choose a unique slug for your post.",
                });
                return;
            }
            throw error;
        }
        if (!newPost) throw new Error("Could not create post.");

        toast({ title: "Success", description: "Blog post created successfully." });
        router.push(`/admin/blog/${newPost.slug}`);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    }
  }

  const handleDelete = async () => {
    if (!post) return;
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    
    try {
        const { error } = await supabase.from('blog_posts').delete().eq('id', post.id);
        if (error) throw error;
        toast({ title: "Success", description: "Post deleted successfully." });
        router.push('/admin/blog');
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error deleting post",
            description: error.message,
        });
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input placeholder="The Art of Pairing Chocolate" {...field} onChange={handleTitleChange} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                        <Input placeholder="the-art-of-pairing-chocolate" {...field} />
                    </FormControl>
                    <FormDescription>The unique identifier for the URL. Must be unique.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                        <RichTextEditor
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        placeholder="Discover the secrets to pairing fine chocolates..."
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="space-y-8">
                 <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://placehold.co/1200x675.png" {...field} />
                        </FormControl>
                        <FormDescription>
                            Use a service like <a href="https://placehold.co/" target="_blank" rel="noopener noreferrer" className="underline">placehold.co</a> for placeholders.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
            </div>
        </div>
        
        <FormField
          control={form.control}
          name="ai_hint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Hint</FormLabel>
              <FormControl>
                <Input placeholder="e.g. chocolate blog" {...field} />
              </FormControl>
               <FormDescription>
                A hint for AI to generate a relevant placeholder image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2 pt-4 border-t">
          <h3 className="text-lg font-medium">SEO Settings</h3>
          <p className="text-sm text-muted-foreground">Customize the meta title and description for search engines.</p>
        </div>
         <FormField
          control={form.control}
          name="meta_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Title</FormLabel>
              <FormControl>
                <Input placeholder="The Art of Pairing Chocolate | InSecret Blog" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="meta_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Learn the secrets of pairing chocolate with wine, cheese, and more in our expert guide." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4 border-t">
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            {post && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                    <Trash className="mr-2 h-4 w-4" /> Delete Post
                </Button>
            )}
        </div>
      </form>
    </Form>
  )
}
