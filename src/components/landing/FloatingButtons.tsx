'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import { cn } from '@/lib/utils';

const FloatingButtons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      <Link href="https://wa.me/1234567890" target="_blank" className="whatsapp-float" aria-label="Contact us on WhatsApp">
        <WhatsappIcon className="w-8 h-8"/>
      </Link>
      <button
        aria-label="Scroll to top"
        onClick={scrollToTop}
        className={cn('scroll-to-top', isVisible && 'visible')}
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </div>
  );
};

export default FloatingButtons;
