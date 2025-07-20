import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SiteSettingsForm from "./_components/SiteSettingsForm";

export default async function SiteSettingsPage() {
    const supabase = createSupabaseServerClient();
    
    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .in('group', ['general', 'contact', 'social', 'notifications'])
        .order('id', { ascending: true });

    const generalSettings = settings?.filter(s => s.group === 'general') ?? [];
    const contactSettings = settings?.filter(s => s.group === 'contact') ?? [];
    const socialSettings = settings?.filter(s => s.group === 'social') ?? [];
    const notificationSettings = settings?.filter(s => s.group === 'notifications') ?? [];

    return (
         <div className="flex flex-col gap-4 py-4">
            <h1 className="text-lg font-semibold md:text-xl">General Site Settings</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Global Site Details</CardTitle>
                    <CardDescription>
                        Manage general settings for your site, including branding, top banner, and SEO fallbacks.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {generalSettings.length > 0 ? (
                        <SiteSettingsForm settings={generalSettings} revalidatePaths={['/']} gridCols={1} />
                    ) : (
                        <p className="text-muted-foreground">No general settings found. Please run the provided schema.sql in your Supabase SQL editor to populate the database.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                        Update the contact details displayed across your site.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     {contactSettings.length > 0 ? (
                        <SiteSettingsForm settings={contactSettings} revalidatePaths={['/contact', '/about']} />
                     ) : (
                        <p className="text-muted-foreground">No contact settings found. Please run the provided schema.sql in your Supabase SQL editor to populate the database.</p>
                     )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Social Media Links</CardTitle>
                    <CardDescription>
                        Enter the full URLs for your social media profiles and toggle their visibility.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {socialSettings.length > 0 ? (
                        <SiteSettingsForm settings={socialSettings} revalidatePaths={['/']} gridCols={1} />
                    ) : (
                        <p className="text-muted-foreground">No social media settings found. Please run the provided schema.sql in your Supabase SQL editor to populate the database.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                        Configure notifications for contact form submissions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {notificationSettings.length > 0 ? (
                        <SiteSettingsForm settings={notificationSettings} />
                    ) : (
                        <p className="text-muted-foreground">No notification settings found. Please run the provided schema.sql in your Supabase SQL editor to populate the database.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
