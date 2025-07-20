import type {Metadata, Viewport} from 'next';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import TopBanner from '@/components/landing/TopBanner';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import FloatingButtons from '@/components/landing/FloatingButtons';

const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createSupabaseServerClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['site_name', 'site_description', 'site_meta_image_url', 'site_favicon_url']);
  
  const getSetting = (key: string) => settings?.find(s => s.key === key)?.value;

  const siteName = getSetting('site_name') || 'InSecret Chocolatier';
  const title = getSetting('site_title') || 'InSecret Chocolatier | Luxury Handcrafted Chocolates';
  const description = getSetting('site_description') || 'Indulge in our meticulously crafted chocolates, where each piece embodies the perfect harmony of tradition and innovation.';
  const imageUrl = getSetting('site_meta_image_url') || '/logo.svg';
  const faviconUrl = getSetting('site_favicon_url') || '/logo.svg';


  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description: description,
    metadataBase: new URL(url),
    openGraph: {
      title: title,
      description: description,
      url: url,
      siteName: siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} Logo`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [`${url}${imageUrl}`],
    },
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export const viewport: Viewport = {
  themeColor: 'hsl(40 43% 94%)',
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createSupabaseServerClient();
  const { data: settings } = await supabase.from('site_settings').select('key, value').in('key', ['top_banner_text', 'top_banner_enabled', 'site_logo_url']);
  const getSetting = (key: string, defaultValue: any = '') => settings?.find(s => s.key === key)?.value ?? defaultValue;

  const topBannerText = getSetting('top_banner_text');
  const topBannerEnabled = getSetting('top_banner_enabled', 'false') === 'true';
  const logoUrl = getSetting('site_logo_url', '/logo.svg');


  return (
    <>
      <TopBanner text={topBannerText} enabled={topBannerEnabled} />
      <Header logoUrl={logoUrl} />
      {children}
      <Footer />
      <FloatingButtons />
    </>
  );
}
