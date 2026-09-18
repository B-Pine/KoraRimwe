import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { moreNav } from '@/components/layout/nav-config';

export const metadata: Metadata = {
  title: 'More',
  description: 'Road signs, revision centre and statistics.',
};

export default function MorePage() {
  return (
    <>
      <PageHeader eyebrow="More" title="All modules" />

      <div className="container py-8">
        <ul className="grid gap-3">
          {moreNav.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Card className="relative transition-shadow hover:shadow-card">
                  <CardContent className="flex items-center gap-4 p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <Link href={item.href} className="after:absolute after:inset-0">
                        <span className="block font-medium text-foreground">{item.label}</span>
                      </Link>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold">About KoraRimwe</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Questions, road signs and definitions are quoted from the official Amategeko y’Umuhanda
            books. Your progress is stored in this browser only — there is no account and nothing is
            uploaded. Always confirm current rules with the Rwanda National Police before your exam.
          </p>
        </div>
      </div>
    </>
  );
}
