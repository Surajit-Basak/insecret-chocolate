
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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2, Trash } from "lucide-react"
import RichTextEditor from "./RichTextEditor"
import { Textarea } from "@/components/ui/textarea"
import { type ProductWithImages } from "@/lib/types"
import ProductGalleryManager from "./ProductGalleryManager"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') 
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

const productFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  slug: z.string().min(2, "Slug must be at least 2 characters."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  image_url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  is_best_seller: z.boolean().default(false).optional(),
  category: z.string().optional(),
  badge: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  ai_hint: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  product?: ProductWithImages;
  categories: string[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createSupabaseBrowserClient()
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: product?.title ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      image_url: product?.image_url ?? "",
      is_best_seller: product?.is_best_seller ?? false,
      category: product?.category ?? "",
      badge: product?.badge ?? "",
      meta_title: product?.meta_title ?? "",
      meta_description: product?.meta_description ?? "",
      ai_hint: product?.ai_hint ?? "",
    }
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

  const onSubmit = async (data: ProductFormValues) => {
    setIsSaving(true);
    try {
      if (product) {
        const { error } = await supabase
          .from('products')
          .update(data)
          .eq('id', product.id);
        if (error) throw error;
        toast({ title: "Success", description: "Product updated successfully." });
        router.refresh();
      } else {
        const { error, data: newProduct } = await supabase.from('products').insert([data]).select().single();
        if (error) {
            if (error.code === '23505') {
                 toast({
                    variant: "destructive",
                    title: "Slug already exists",
                    description: "Please choose a unique slug for your product.",
                });
                return;
            }
            throw error;
        }
        if (!newProduct) throw new Error("Failed to create product.");
        
        toast({ title: "Success", description: "Product created successfully." });
        router.push(`/admin/products/${newProduct.slug}`);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
        setIsSaving(false);
    }
  }

  const handleDelete = async () => {
    if (!product) return;
    if (!confirm("Are you sure you want to delete this product? This will also remove all gallery associations.")) return;
    setIsSaving(true);
    try {
        await supabase.from('product_images').delete().eq('product_id', product.id);
        
        const { error } = await supabase.from('products').delete().eq('id', product.id);
        if (error) throw error;
        
        toast({ title: "Success", description: "Product deleted successfully." });
        
        router.push('/admin/products');
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error deleting product",
            description: error.message,
        });
    } finally {
        setIsSaving(false);
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
                        <Input placeholder="Velvet Truffle Box" {...field} onChange={handleTitleChange} />
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
                        <Input placeholder="velvet-truffle-box" {...field} />
                    </FormControl>
                    <FormDescription>The unique identifier for the URL. Must be unique.</FormDescription>
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
                        <RichTextEditor
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            placeholder="A decadent assortment of rich, velvety chocolate truffles."
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
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="45.00" {...field} />
                        </FormControl>
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
                <FormField
                    control={form.control}
                    name="badge"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Badge</FormLabel>
                        <FormControl>
                            <Input placeholder="New" {...field} />
                        </FormControl>
                        <FormDescription>
                            Optional text to display as a badge on the product card.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="is_best_seller"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            Best Seller
                            </FormLabel>
                            <FormDescription>
                            Mark this product as a best seller to feature it on the homepage.
                            </FormDescription>
                        </div>
                        </FormItem>
                    )}
                    />
            </div>
        </div>
        
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/600x750.png" {...field} />
              </FormControl>
               <FormDescription>
                This is the primary image for the product card. Use the gallery manager below for additional images.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ai_hint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Hint</FormLabel>
              <FormControl>
                <Input placeholder="e.g. chocolate box" {...field} />
              </FormControl>
               <FormDescription>
                A hint for AI to generate a relevant placeholder image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {product && <ProductGalleryManager product={product} />}
        
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
                <Input placeholder="Buy Velvet Truffle Box | InSecret Chocolatier" {...field} />
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
                <Textarea placeholder="Indulge in our exquisite Velvet Truffle Box, a perfect gift for any chocolate lover." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4 border-t">
            <Button type="submit" disabled={isSaving}>
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
            </Button>
            {product && (
                <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSaving}>
                    <Trash className="mr-2 h-4 w-4" /> Delete Product
                </Button>
            )}
        </div>
      </form>
    </Form>
  )
}
