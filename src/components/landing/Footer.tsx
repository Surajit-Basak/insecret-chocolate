import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { PinterestIcon } from '@/components/icons/PinterestIcon';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type Settings = {
  [key: string]: string;
}

const Footer = async () => {
  const currentYear = new Date().getFullYear();
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('site_settings').select('key, value').in('group', ['contact', 'social', 'general']);
  
  const settings = data?.reduce((acc, { key, value }) => {
      acc[key] = value || '';
      return acc;
  }, {} as Settings) ?? {};

  const logoUrl = settings.site_logo_white_url || '/logo-white.svg';

  return (
    <footer className="bg-primary text-white pt-24 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-2">
            <Link href="/" className="block mb-8">
              <Image src={logoUrl} alt="InSecret Logo" width={150} height={56} className="h-14 w-auto"/>
            </Link>
            <p className="font-body text-white/80 mb-8 leading-relaxed max-w-md">Crafting exceptional chocolates with passion and precision since 2010. Every piece tells a story of artistry and dedication to perfection.</p>
            <div className="flex gap-4">
              {settings.social_instagram_enabled === 'true' && settings.social_instagram && (
                <Link href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <Instagram className="text-xl" />
                </Link>
              )}
               {settings.social_facebook_enabled === 'true' && settings.social_facebook && (
                <Link href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <Facebook className="text-xl" />
                </Link>
               )}
               {settings.social_twitter_enabled === 'true' && settings.social_twitter && (
                <Link href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <Twitter className="text-xl" />
                </Link>
               )}
               {settings.social_pinterest_enabled === 'true' && settings.social_pinterest && (
                <Link href={settings.social_pinterest} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                  <PinterestIcon className="text-xl" />
                </Link>
               )}
            </div>
          </div>
          <div>
            <h3 className="font-headline text-xl mb-6">Quick Links</h3>
            <ul className="space-y-4 font-body">
              <li><Link href="/shop" className="text-white/70 hover:text-white transition-colors">Shop All</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-white/70 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-xl mb-6">Customer Care</h3>
            <ul className="space-y-4 font-body">
              <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">Returns Policy</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-xl mb-6">Visit Us</h3>
            <address className="not-italic">
              <div className="font-body text-white/70 space-y-4">
                {settings.contact_address && (
                    <p className="flex items-start gap-3">
                    <MapPin className="text-accent mt-1 shrink-0" />
                    <span>{settings.contact_address.replace(/\\n/g, '\n')}</span>
                    </p>
                )}
                {settings.contact_phone && (
                    <p className="flex items-start gap-3">
                    <Phone className="text-accent mt-1 shrink-0" />
                    <span>{settings.contact_phone}</span>
                    </p>
                )}
                {settings.contact_email && (
                    <p className="flex items-start gap-3">
                    <Mail className="text-accent mt-1 shrink-0" />
                    <span>{settings.contact_email}</span>
                    </p>
                )}
              </div>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="font-body text-white/60 text-sm">
              © {currentYear} {settings.site_name || "InSecret Chocolatier"}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="font-body text-white/60 text-sm hover:text-white">Privacy Policy</Link>
              <Link href="#" className="font-body text-white/60 text-sm hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
