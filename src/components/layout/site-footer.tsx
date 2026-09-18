import Link from 'next/link';
import { Logo } from '@/components/layout/logo';
import { primaryNav } from '@/components/layout/nav-config';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo showTagline />
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              A study and examination platform for the Rwandan driving theory test. Questions and
              road signs are taken from the official Amategeko y’Umuhanda books; your progress is
              stored on this device only.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold text-foreground">Modules</h2>
            <ul className="mt-3 grid gap-2">
              {primaryNav.slice(1).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-xs leading-5 text-muted-foreground">
          Study aid only. Always confirm the current rules with the Rwanda National Police and the
          official Amategeko y’Umuhanda before sitting your examination.
        </p>
      </div>
    </footer>
  );
}
