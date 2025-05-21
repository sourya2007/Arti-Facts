'use client';

import Link from 'next/link';
import { Landmark, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/analyze', label: 'Analyze' },
  { href: '/history', label: 'History' },
  { href: '/search', label: 'Search' },
  { href: '/about', label: 'About' },
];

const AppBrand = () => (
  <Link href="/" className="flex items-center gap-2 text-xl font-serif font-semibold text-primary hover:text-primary/80 transition-colors">
    <Landmark className="h-6 w-6" />
    Histify
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <AppBrand />
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href ? 'text-primary' : 'text-foreground/70'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs bg-background p-6">
                <div className="flex flex-col space-y-6">
                  <div className="flex justify-between items-center">
                     <AppBrand />
                    <SheetTrigger asChild>
                       <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                         <X className="h-6 w-6" />
                         <span className="sr-only">Close menu</span>
                       </Button>
                    </SheetTrigger>
                  </div>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                        pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-foreground/70'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
