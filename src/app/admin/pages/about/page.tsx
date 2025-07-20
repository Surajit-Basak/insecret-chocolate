import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SiteSettingsForm from "../../settings/_components/SiteSettingsForm";

const aboutPageSections = {
    'SEO': ['about_meta_title', 'about_meta_description'],
    'Page Header': ['about_title', 'about_subtitle'],
    'Our Story': ['about_story', 'about_image_url'],
    'Why Choose Us': ['why_title', 'why_feature1_title', 'why_feature1_desc', 'why_feature2_title', 'why_feature2_desc', 'why_feature3_title', 'why_feature3_desc'],
}

export default async function AboutPageSettings() {
    const supabase = createSupabaseServerClient();
    const { data: settings } = await supabase.from('site_settings').select('*').order('id', { ascending: true });

    return (
        <div className="flex flex-col gap-4 py-4">
            <h1 className="text-lg font-semibold md:text-xl">Edit About Page Content</h1>
            {Object.entries(aboutPageSections).map(([sectionTitle, keys]) => {
                const sectionSettings = settings?.filter(s => keys.includes(s.key));
                if (!sectionSettings || sectionSettings.length === 0) return null;

                return (
                    <Card key={sectionTitle}>
                        <CardHeader>
                            <CardTitle>{sectionTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SiteSettingsForm settings={sectionSettings} revalidatePaths={['/about']} />
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
