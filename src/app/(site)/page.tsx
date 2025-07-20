
import HeroSlider from '@/components/landing/HeroSlider';
import SignatureCollections from '@/components/landing/SignatureCollections';
import LegacyOfExcellence from '@/components/landing/LegacyOfExcellence';
import LatestCreations from '@/components/landing/LatestCreations';
import Testimonials from '@/components/landing/Testimonials';
import BestSellers from '@/components/landing/BestSellers';
import SymphonyOfFlavors from '@/components/landing/SymphonyOfFlavors';
import Newsletter from '@/components/landing/Newsletter';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = createSupabaseServerClient();
  const { data: settings } = await supabase.from('site_settings').select('*');

  const getSetting = (key: string) => settings?.find(s => s.key === key)?.value ?? '';

  const homeSettings = {
    // Slider 1
    hero1_tagline: getSetting('hero1_tagline'),
    hero1_title: getSetting('hero1_title'),
    hero1_description: getSetting('hero1_description'),
    hero1_image_url: getSetting('hero1_image_url'),
    
    // Slider 2
    hero2_tagline: getSetting('hero2_tagline'),
    hero2_title: getSetting('hero2_title'),
    hero2_description: getSetting('hero2_description'),
    hero2_image_url: getSetting('hero2_image_url'),

    // Slider 3
    hero3_tagline: getSetting('hero3_tagline'),
    hero3_title: getSetting('hero3_title'),
    hero3_description: getSetting('hero3_description'),
    hero3_image_url: getSetting('hero3_image_url'),
    
    collections_tagline: getSetting('collections_tagline'),
    collections_title: getSetting('collections_title'),
    collections_description: getSetting('collections_description'),
    legacy_tagline: getSetting('legacy_tagline'),
    legacy_title: getSetting('legacy_title'),
    legacy_image_url: getSetting('legacy_image_url'),
    legacy_feature1_title: getSetting('legacy_feature1_title'),
    legacy_feature1_desc: getSetting('legacy_feature1_desc'),
    legacy_feature2_title: getSetting('legacy_feature2_title'),
    legacy_feature2_desc: getSetting('legacy_feature2_desc'),
    legacy_feature3_title: getSetting('legacy_feature3_title'),
    legacy_feature3_desc: getSetting('legacy_feature3_desc'),
    creations_tagline: getSetting('creations_tagline'),
    creations_title: getSetting('creations_title'),
    creations_description: getSetting('creations_description'),
    creations_bg_image_url: getSetting('creations_bg_image_url'),
    bestsellers_tagline: getSetting('bestsellers_tagline'),
    bestsellers_title: getSetting('bestsellers_title'),
    bestsellers_description: getSetting('bestsellers_description'),
    flavors_tagline: getSetting('flavors_tagline'),
    flavors_title: getSetting('flavors_title'),
    flavors_description: getSetting('flavors_description'),
    newsletter_tagline: getSetting('newsletter_tagline'),
    newsletter_title: getSetting('newsletter_title'),
    newsletter_description: getSetting('newsletter_description'),
  };

  return (
    <main>
      <HeroSlider settings={homeSettings} />
      <SignatureCollections settings={homeSettings} />
      <LegacyOfExcellence settings={homeSettings} />
      <LatestCreations settings={homeSettings} />
      <Testimonials />
      <BestSellers settings={homeSettings} />
      <SymphonyOfFlavors settings={homeSettings} />
      <Newsletter settings={homeSettings} />
    </main>
  );
}
