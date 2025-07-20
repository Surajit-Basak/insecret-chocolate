import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import ContactForm from "./_components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createSupabaseServerClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['site_name', 'contact_meta_title', 'contact_meta_description', 'contact_title', 'contact_subtitle']);
  
  const getSetting = (key: string, fallbackKey?: string) => settings?.find(s => s.key === key)?.value || settings?.find(s => s.key === (fallbackKey ?? ''))?.value;

  const siteName = getSetting('site_name') || 'InSecret';
  const title = getSetting('contact_meta_title', 'contact_title') || 'Contact Us';
  const description = getSetting('contact_meta_description', 'contact_subtitle') || '';

  return {
    title: `${title} | ${siteName}`,
    description: description,
  };
}

export default async function ContactPage() {
  const supabase = createSupabaseServerClient();
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['contact_title', 'contact_subtitle', 'contact_address', 'contact_email', 'contact_phone']);

  const settings = settingsData?.reduce((acc, { key, value }) => {
    acc[key] = value || '';
    return acc;
  }, {} as { [key: string]: string }) || {};

  return (
    <main>
      <section className="py-20 text-center bg-primary text-white">
          <h1 className="text-5xl font-headline">{settings.contact_title || 'Get in Touch'}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">{settings.contact_subtitle || "We'd love to hear from you. For inquiries, orders, or just to say hello."}</p>
      </section>
      <section className="py-24">
          <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div>
                      <h2 className="text-3xl font-headline mb-4">Contact Information</h2>
                      <p className="text-muted-foreground mb-8">Feel free to reach out to us through any of the following methods. Our team is ready to assist you.</p>
                      <div className="space-y-4 font-body">
                          <p><strong>Address:</strong> {settings.contact_address || 'Loading...'}</p>
                          <p><strong>Email:</strong> {settings.contact_email || 'Loading...'}</p>
                          <p><strong>Phone:</strong> {settings.contact_phone || 'Loading...'}</p>
                      </div>
                  </div>
                  <div>
                    <ContactForm />
                  </div>
              </div>
          </div>
      </section>
    </main>
  );
}
