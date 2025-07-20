import { createSupabaseServerClient } from "@/lib/supabase/server";
import MediaClientPage from "./_components/MediaClientPage";

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const supabase = createSupabaseServerClient();
  const { data: mediaItems } = await supabase.from('media').select('*').order('created_at', { ascending: false });

  return (
    <MediaClientPage mediaItems={mediaItems || []} />
  );
}
