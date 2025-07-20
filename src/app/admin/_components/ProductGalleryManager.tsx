
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Media, type ProductWithImages } from "@/lib/types";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check, GripVertical, ImageOff, Plus, Trash, X } from "lucide-react";
import { revalidatePathsAction } from "../actions";

interface ProductGalleryManagerProps {
  product: ProductWithImages;
}

export default function ProductGalleryManager({ product }: ProductGalleryManagerProps) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { toast } = useToast();
  
  const [galleryImages, setGalleryImages] = useState(product.product_images || []);
  const [availableMedia, setAvailableMedia] = useState<Media[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (error) {
        toast({ variant: 'destructive', title: 'Error fetching media', description: error.message });
      } else {
        const productMediaIds = new Set(galleryImages.map(img => img.media_id));
        setAvailableMedia(data.filter(media => !productMediaIds.has(media.id)));
      }
    };
    if (isModalOpen) {
      fetchMedia();
    }
  }, [isModalOpen, supabase, galleryImages, toast]);

  const handleAddImage = async (mediaId: string) => {
    const newOrder = galleryImages.length;
    const { data, error } = await supabase
      .from('product_images')
      .insert({ product_id: product.id, media_id: mediaId, display_order: newOrder })
      .select('*, media(*)')
      .single();

    if (error) {
      toast({ variant: 'destructive', title: 'Error adding image', description: error.message });
    } else if (data) {
        // We need to cast the nested media object correctly
        const newGalleryImage = {
            ...data,
            media: Array.isArray(data.media) ? data.media[0] : data.media,
        };
        
        // @ts-ignore - Supabase return type for select with join needs help
        setGalleryImages(prev => [...prev, newGalleryImage]);

        // Remove from available media
        setAvailableMedia(prev => prev.filter(media => media.id !== mediaId));
        toast({ title: "Success", description: "Image added to gallery." });
        await revalidatePathsAction([`/shop/${product.slug}`]);
        router.refresh();
    }
  };

  const handleRemoveImage = async (mediaId: string) => {
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', product.id)
      .eq('media_id', mediaId);

    if (error) {
      toast({ variant: 'destructive', title: 'Error removing image', description: error.message });
    } else {
      setGalleryImages(prev => prev.filter(img => img.media_id !== mediaId));
      toast({ title: 'Success', description: 'Image removed from gallery.' });
      await revalidatePathsAction([`/shop/${product.slug}`]);
      router.refresh();
    }
  };

  const handleReorder = async (newOrder: typeof galleryImages) => {
    const updates = newOrder.map((item, index) => 
        supabase
        .from('product_images')
        .update({ display_order: index })
        .eq('product_id', product.id)
        .eq('media_id', item.media_id)
    );
    
    const results = await Promise.all(updates);
    const hasError = results.some(res => res.error);

    if (hasError) {
        toast({ variant: 'destructive', title: 'Error', description: "Failed to reorder images." });
    } else {
        setGalleryImages(newOrder);
        toast({ title: "Success", description: "Gallery order updated." });
        await revalidatePathsAction([`/shop/${product.slug}`]);
        router.refresh();
    }
  };
  
  // Basic drag-and-drop logic
  const dragItem = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('draggedItemIndex', index.toString());
  };

  const dropItem = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    const draggedItemIndex = parseInt(e.dataTransfer.getData('draggedItemIndex'), 10);
    const newItems = [...galleryImages];
    const [reorderedItem] = newItems.splice(draggedItemIndex, 1);
    newItems.splice(dropIndex, 0, reorderedItem);
    handleReorder(newItems);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Gallery</CardTitle>
        <CardDescription>Manage the images for this product's gallery. Drag to reorder.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-6">
          {galleryImages.sort((a,b) => a.display_order - b.display_order).map((image, index) => (
            <div 
              key={image.media_id} 
              className="relative group aspect-square border rounded-lg overflow-hidden"
              draggable
              onDragStart={(e) => dragItem(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => dropItem(e, index)}
            >
              <Image src={image.media.url} alt={image.media.alt_text || 'Gallery image'} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleRemoveImage(image.media_id)}>
                  <Trash className="h-4 w-4" />
                </Button>
                <div className="absolute top-1 right-1 text-white cursor-move">
                    <GripVertical className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="aspect-square h-full w-full flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span>Add Image</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Select Media to Add</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto">
                {availableMedia.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {availableMedia.map(media => (
                      <Card key={media.id} className="group overflow-hidden relative">
                         <div className="relative w-full aspect-square">
                            <Image src={media.url} alt={media.alt_text || ''} fill className="object-cover"/>
                         </div>
                         <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                            <p className="text-white text-xs font-bold mb-2">{media.name}</p>
                            <Button size="sm" onClick={() => handleAddImage(media.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                Add
                            </Button>
                         </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                    <ImageOff className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold">No more images available</h3>
                    <p className="mt-1 text-sm text-gray-500">All media items are already in the gallery or you have none uploaded.</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
