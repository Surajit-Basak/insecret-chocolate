import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SiteSettingsForm from "../../settings/_components/SiteSettingsForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const heroSliderSections = {
    'Hero Slider 1': ['hero1_tagline', 'hero1_title', 'hero1_description', 'hero1_image_url'],
    'Hero Slider 2': ['hero2_tagline', 'hero2_title', 'hero2_description', 'hero2_image_url'],
    'Hero Slider 3': ['hero3_tagline', 'hero3_title', 'hero3_description', 'hero3_image_url'],
}

const homepageSections = {
    'SEO': ['home_meta_title', 'home_meta_description'],
    'Signature Collections': ['collections_tagline', 'collections_title', 'collections_description'],
    'Legacy of Excellence': ['legacy_tagline', 'legacy_title', 'legacy_image_url', 'legacy_feature1_title', 'legacy_feature1_desc', 'legacy_feature2_title', 'legacy_feature2_desc', 'legacy_feature3_title', 'legacy_feature3_desc'],
    'Latest Creations': ['creations_tagline', 'creations_title', 'creations_description', 'creations_bg_image_url'],
    'Best Sellers': ['bestsellers_tagline', 'bestsellers_title', 'bestsellers_description'],
    'Symphony of Flavors': ['flavors_tagline', 'flavors_title', 'flavors_description'],
    'Newsletter': ['newsletter_tagline', 'newsletter_title', 'newsletter_description'],
}

export default async function HomePageSettings() {
    const supabase = createSupabaseServerClient();
    const { data: settings } = await supabase.from('site_settings').select('*').order('id', { ascending: true });

    return (
        <div className="flex flex-col gap-4 py-4">
            <h1 className="text-lg font-semibold md:text-xl">Edit Homepage Content</h1>
            
            {Object.entries(homepageSections).map(([sectionTitle, keys]) => {
                const sectionSettings = settings?.filter(s => keys.includes(s.key));
                if (!sectionSettings || sectionSettings.length === 0) return null;

                return (
                    <Card key={sectionTitle}>
                        <CardHeader className="flex flex-row items-center justify-between">
                           <div>
                             <CardTitle>{sectionTitle}</CardTitle>
                             {sectionTitle === 'SEO' && <CardDescription>Manage the meta title and description for the homepage.</CardDescription>}
                           </div>
                           {(sectionTitle === 'Signature Collections' || sectionTitle === 'Symphony of Flavors') && (
                              <Button asChild>
                                <Link href={`/admin/pages/home/${sectionTitle.toLowerCase().replace(/ /g, '-')}`}>Edit Items</Link>
                              </Button>
                           )}
                        </CardHeader>
                        <CardContent>
                            <SiteSettingsForm settings={sectionSettings} revalidatePaths={['/']} />
                        </CardContent>
                    </Card>
                );
            })}
            
            <Card>
                <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                    <CardDescription>Manage the content for the three slides in the hero section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.entries(heroSliderSections).map(([sectionTitle, keys]) => {
                        const sectionSettings = settings?.filter(s => keys.includes(s.key));
                        if (!sectionSettings || sectionSettings.length === 0) return null;

                        return (
                            <Card key={sectionTitle}>
                                <CardHeader>
                                    <CardTitle>{sectionTitle}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <SiteSettingsForm settings={sectionSettings} revalidatePaths={['/']} />
                                </CardContent>
                            </Card>
                        );
                    })}
                </CardContent>
            </Card>

        </div>
    );
}
