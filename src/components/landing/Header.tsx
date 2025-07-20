"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

type HeaderProps = {
  logoUrl: string;
}

const Header = ({ logoUrl }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-accent/20">
      <nav className="container mx-auto px-6 flex items-center justify-between h-24">
        {/* Logo */}
        <Link href="/" className="block flex-shrink-0">
          <Image src={logoUrl} alt="InSecret Logo" width={140} height={56} className="h-14 w-auto"/>
        </Link>
        
        {/* Desktop Navigation & Search */}
        <div className="hidden lg:flex items-center justify-end gap-6">
            <div className="flex items-center gap-2">
                <div className={`relative transition-all duration-300 ${isSearchOpen ? 'w-48' : 'w-0'}`}>
                   <Input 
                      type="text" 
                      placeholder="Search..." 
                      className={`w-full h-9 transition-all duration-300 rounded-button ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}
                    />
                </div>
                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                    <Search className="h-5 w-5 text-foreground/70" />
                    <span className="sr-only">Search</span>
                </Button>
            </div>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="font-body text-foreground/70 hover:text-foreground text-sm tracking-wide uppercase transition-colors">
                {link.label}
              </Link>
            ))}
        </div>
        
        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
            <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-button">
                <Menu className="text-xl" />
                <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white p-6 w-full max-w-sm">
                <SheetTitle className="sr-only">Main Menu</SheetTitle>
                <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                    <Link href="/" className="block">
                        <Image src={logoUrl} alt="InSecret Logo" width={140} height={56} className="h-14 w-auto"/>
                    </Link>
                </div>
                <div className="relative mb-6">
                    <Input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full h-10 pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <nav className="flex flex-col gap-6">
                    {navLinks.map((link) => (
                    <SheetTrigger asChild key={link.label}>
                        <Link href={link.href} className="font-body text-lg text-foreground/80 hover:text-foreground transition-colors">
                        {link.label}
                        </Link>
                    </SheetTrigger>
                    ))}
                </nav>
                </div>
            </SheetContent>
            </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;
