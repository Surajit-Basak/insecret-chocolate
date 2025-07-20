import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createSupabaseServerClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['site_name', 'about_meta_title', 'about_meta_description', 'about_title', 'about_subtitle']);
  
  const getSetting = (key: string, fallbackKey?: string) => settings?.find(s => s.key === key)?.value || settings?.find(s => s.key === (fallbackKey ?? ''))?.value;

  const siteName = getSetting('site_name') || 'InSecret';
  const title = getSetting('about_meta_title', 'about_title') || 'About Us';
  const description = getSetting('about_meta_description', 'about_subtitle') || '';

  return {
    title: `${title} | ${siteName}`,
    description: description,
  };
}


export default async function AboutPage() {
  const supabase = createSupabaseServerClient();
  const { data: settings } = await supabase.from('site_settings').select('*');

  const getSetting = (key: string) => settings?.find(s => s.key === key)?.value ?? '';
  
  const aboutSettings = {
    about_title: getSetting('about_title'),
    about_subtitle: getSetting('about_subtitle'),
    about_story: getSetting('about_story'),
    about_image_url: getSetting('about_image_url'),
    why_title: getSetting('why_title'),
    why_feature1_title: getSetting('why_feature1_title'),
    why_feature1_desc: getSetting('why_feature1_desc'),
    why_feature2_title: getSetting('why_feature2_title'),
    why_feature2_desc: getSetting('why_feature2_desc'),
    why_feature3_title: getSetting('why_feature3_title'),
    why_feature3_desc: getSetting('why_feature3_desc'),
  };

  return (
    <main>
      <section className="py-20 text-center bg-primary text-white">
          <h1 className="text-5xl font-headline">{aboutSettings.about_title}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">{aboutSettings.about_subtitle}</p>
      </section>
      <section className="py-24">
          <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="flex-1">
                      <Image 
                      src={aboutSettings.about_image_url || "https://placehold.co/800x600.png"}
                      alt="Our Story"
                      width={800}
                      height={600}
                      className="w-full rounded-lg shadow-lg"
                      />
                  </div>
                  <div className="flex-1">
                      <h2 className="font-headline text-4xl mb-6">Our Story</h2>
                       <div 
                          className="font-body text-muted-foreground mb-4 leading-relaxed prose max-w-none" 
                          dangerouslySetInnerHTML={{ __html: aboutSettings.about_story }} 
                      />
                  </div>
              </div>
          </div>
      </section>
      <section className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
               <h2 className="font-headline text-4xl mb-12">{aboutSettings.why_title}</h2>
               <div className="grid md:grid-cols-3 gap-8">
                  <div>
                      <h3 className="font-headline text-2xl mb-4">{aboutSettings.why_feature1_title}</h3>
                      <p className="text-muted-foreground">{aboutSettings.why_feature1_desc}</p>
                  </div>
                  <div>
                      <h3 className="font-headline text-2xl mb-4">{aboutSettings.why_feature2_title}</h3>
                      <p className="text-muted-foreground">{aboutSettings.why_feature2_desc}</p>
                  </div>
                  <div>
                      <h3 className="font-headline text-2xl mb-4">{aboutSettings.why_feature3_title}</h3>
                      <p className="text-muted-foreground">{aboutSettings.why_feature3_desc}</p>
                  </div>
               </div>
          </div>
      </section>
    </main>
  );
}
