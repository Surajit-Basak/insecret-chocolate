import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type NewsletterProps = {
  settings: {
    newsletter_tagline: string;
    newsletter_title: string;
    newsletter_description: string;
  }
}

const Newsletter = ({ settings }: NewsletterProps) => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mx-auto text-center">
          <span className="font-body text-accent uppercase tracking-widest text-sm mb-4 block">{settings.newsletter_tagline}</span>
          <h2 className="font-headline text-4xl mb-6">{settings.newsletter_title}</h2>
          <p className="font-body text-muted-foreground mb-8">{settings.newsletter_description}</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-6 rounded-button border-none bg-white text-base focus-visible:ring-accent"
            />
            <Button 
              type="submit" 
              className="whitespace-nowrap px-8 py-6 font-body rounded-button"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
