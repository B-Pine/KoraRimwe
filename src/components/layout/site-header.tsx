'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/layout/logo';
import { primaryNav } from '@/components/layout/nav-config';
import { SearchTrigger } from '@/components/search/search-trigger';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="rounded-lg focus-visible:ring-2 focus-visible:ring-ring">
          <Logo />
          <span className="sr-only">KoraRimwe home</span>
        </Link>

        <nav aria-label="Main" className="ml-4 hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchTrigger />
        </div>
      </div>
    </header>
  );
}
