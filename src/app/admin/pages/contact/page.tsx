import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SiteSettingsForm from "../../settings/_components/SiteSettingsForm";

const contactPageSections = {
    'SEO': ['contact_meta_title', 'contact_meta_description'],
    'Page Content': ['contact_title', 'contact_subtitle'],
}

export default async function ContactPageSettings() {
    const supabase = createSupabaseServerClient();
    const { data: settings } = await supabase.from('site_settings').select('*').order('id', { ascending: true });

    return (
        <div className="flex flex-col gap-4 py-4">
            <h1 className="text-lg font-semibold md:text-xl">Edit Contact Page Content</h1>
            {Object.entries(contactPageSections).map(([sectionTitle, keys]) => {
                const sectionSettings = settings?.filter(s => keys.includes(s.key));
                if (!sectionSettings || sectionSettings.length === 0) return null;

                return (
                    <Card key={sectionTitle}>
                        <CardHeader>
                            <CardTitle>{sectionTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SiteSettingsForm settings={sectionSettings} revalidatePaths={['/contact']} />
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
