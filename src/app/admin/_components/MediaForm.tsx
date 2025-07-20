
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useState } from "react"

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
import { Loader2, Trash } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { saveMedia, deleteMedia, uploadFile } from "../media/_actions/page"

const mediaFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  alt_text: z.string().optional(),
})

type MediaFormValues = z.infer<typeof mediaFormSchema>

interface MediaFormProps {
  mediaItem?: MediaFormValues & { id: string };
}

export default function MediaForm({ mediaItem }: MediaFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(mediaItem?.url ?? null);
  
  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: mediaItem || {
      id: undefined,
      name: "",
      url: "",
      alt_text: "",
    },
  })

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (!form.getValues('name')) {
            form.setValue('name', file.name.split('.').slice(0, -1).join('.'));
        }
        const { url, error } = await uploadFile(formData);

        if (error) throw new Error(error);
        if (url) {
          form.setValue('url', url, { shouldValidate: true });
          setPreviewUrl(url);
          toast({ title: "Success", description: "Image uploaded successfully." });
        }
      } catch (error: any) {
        toast({ variant: "destructive", title: "Upload Failed", description: error.message });
        setPreviewUrl(mediaItem?.url ?? null); // Revert preview on failure
      } finally {
        setIsUploading(false);
      }
    }
  }

  const onSubmit = async (data: MediaFormValues) => {
    const result = await saveMedia(data);

    if (result.success) {
        toast({ title: "Success", description: result.message });
        if(mediaItem) {
             router.refresh();
        } else {
             router.push('/admin/media');
             router.refresh();
        }
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.message,
        });
    }
  }

  const handleDelete = async () => {
    if (!mediaItem) return;
    if (!confirm("Are you sure you want to delete this media item? This will also remove it from storage.")) return;

    const result = await deleteMedia(mediaItem.id);

    if (result.success) {
        toast({ title: "Success", description: result.message });
        router.push('/admin/media');
        router.refresh();
    } else {
        toast({
            variant: "destructive",
            title: "Error deleting media item",
            description: result.message,
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
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Hero Image 1" {...field} />
                    </FormControl>
                     <FormDescription>
                        A descriptive name for internal reference.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="alt_text"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Alt Text</FormLabel>
                    <FormControl>
                        <Textarea placeholder="A descriptive text for screen readers and SEO." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="space-y-4">
                <FormLabel>Image</FormLabel>
                <div className="aspect-video relative bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                    {previewUrl && (
                        <Image
                            src={previewUrl}
                            alt="Image preview"
                            fill
                            className="object-contain"
                        />
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                    )}
                    {!previewUrl && !isUploading && (
                        <div className="text-center text-muted-foreground text-sm p-4">
                            Select a file to upload
                        </div>
                    )}
                </div>
                 <FormControl>
                    <Input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} className="text-sm" />
                </FormControl>
            </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
            <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
                {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : (form.formState.isSubmitting ? "Saving..." : "Save Changes")}
            </Button>
            {mediaItem && (
                <Button type="button" variant="destructive" onClick={handleDelete} disabled={form.formState.isSubmitting}>
                    <Trash className="mr-2 h-4 w-4" /> Delete Media Item
                </Button>
            )}
        </div>
      </form>
    </Form>
  )
}
