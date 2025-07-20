
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const mediaFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  alt_text: z.string().optional(),
});

type MediaFormValues = z.infer<typeof mediaFormSchema>;

export async function uploadFile(formData: FormData) {
    const supabase = createSupabaseServerClient();
    const file = formData.get('file') as File;
    
    if (!file) {
        return { error: 'No file provided.' };
    }
    
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = `${fileName}`;

    try {
        const { data, error } = await supabase.storage
            .from('media')
            .upload(filePath, file);

        if (error) {
            console.error('Supabase upload error:', error);
            return { error: `Upload failed: ${error.message}` };
        }

        const { data: publicUrlData } = supabase.storage
            .from('media')
            .getPublicUrl(data.path);
        
        if (!publicUrlData) {
             return { error: 'Failed to get public URL.' };
        }

        return { url: publicUrlData.publicUrl, error: null };

    } catch (e: any) {
        console.error('Catch block error:', e);
        return { error: `An unexpected error occurred: ${e.message}` };
    }
}

export async function saveMedia(data: MediaFormValues) {
  const supabase = createSupabaseServerClient();
  const { id, ...updateData } = data;

  try {
    if (id) {
      // Update existing media
      const { error } = await supabase
        .from('media')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
    } else {
      // Create new media
      if (!updateData.url) {
          return { success: false, message: 'Please upload an image first.' };
      }
      const { error } = await supabase.from('media').insert([updateData]);
      if (error) throw error;
    }
    
    revalidatePath('/admin/media');
    
    return { success: true, message: `Media item ${id ? 'updated' : 'created'} successfully.` };

  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteMedia(id: string) {
    const supabase = createSupabaseServerClient();
    const {data: mediaItem, error: fetchError} = await supabase.from('media').select('url').eq('id', id).single();
    if(fetchError || !mediaItem) {
        return { success: false, message: 'Could not find media item to delete.' };
    }

    const { error: deleteError } = await supabase.from('media').delete().eq('id', id);
    if (deleteError) {
        return { success: false, message: deleteError.message };
    }

    // Delete from storage
    const url = new URL(mediaItem.url);
    const filePath = url.pathname.split('/media/')[1];
    
    if(filePath) {
        const {error: storageError} = await supabase.storage.from('media').remove([filePath]);
        // We can ignore cases where file doesn't exist in storage but does in DB
        if(storageError && storageError.message !== 'The resource was not found') {
             return { success: false, message: `DB entry deleted, but failed to delete from storage: ${storageError.message}` };
        }
    }
    
    revalidatePath('/admin/media');
    return { success: true, message: 'Media item deleted successfully.' };
}
