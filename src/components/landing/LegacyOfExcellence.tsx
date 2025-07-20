import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Award, Heart, Leaf } from 'lucide-react';
import Link from 'next/link';

type LegacyOfExcellenceProps = {
  settings: {
    legacy_tagline: string;
    legacy_title: string;
    legacy_image_url: string;
    legacy_feature1_title: string;
    legacy_feature1_desc: string;
    legacy_feature2_title: string;
    legacy_feature2_desc: string;
    legacy_feature3_title: string;
    legacy_feature3_desc: string;
  }
}

const LegacyOfExcellence = ({ settings }: LegacyOfExcellenceProps) => {

  const features = [
    {
      icon: <Award className="text-primary text-xl" />,
      title: settings.legacy_feature1_title || 'Premium Selection',
      description: settings.legacy_feature1_desc || 'We source the finest single-origin cocoa beans from sustainable farms worldwide.',
    },
    {
      icon: <Heart className="text-primary text-xl" />,
      title: settings.legacy_feature2_title || 'Artisanal Craftsmanship',
      description: settings.legacy_feature2_desc || 'Each piece is handcrafted by our master chocolatiers with meticulous attention to detail.',
    },
    {
      icon: <Leaf className="text-primary text-xl" />,
      title: settings.legacy_feature3_title || 'Sustainable Practice',
      description: settings.legacy_feature3_desc || 'We\'re committed to ethical sourcing and eco-friendly packaging solutions.',
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1">
            <Image 
              src={settings.legacy_image_url || "https://placehold.co/800x600.png"}
              alt="Chocolate Making Process"
              width={800}
              height={600}
              className="w-full rounded-lg shadow-xl"
            />
          </div>
          <div className="flex-1">
            <span className="font-body text-accent uppercase tracking-widest text-sm mb-4 block">{settings.legacy_tagline}</span>
            <h2 className="font-headline text-4xl mb-8">{settings.legacy_title}</h2>
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="w-12 h-12 flex items-center justify-center bg-background rounded-full flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-headline text-xl mb-2">{feature.title}</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild variant="default" className="mt-12 px-10 py-6 font-body text-sm tracking-wider uppercase rounded-button">
              <Link href="/about">Learn Our Story</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacyOfExcellence;
