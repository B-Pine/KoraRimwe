'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SIGN_CATEGORIES, categoryLabel, categoryLabelEn } from '@/components/signs/sign-categories';
import type { RoadSign, SignCategory } from '@/types';
import { cn } from '@/lib/utils';

export function SignsExplorer({ signs }: { signs: RoadSign[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SignCategory | 'all'>('all');

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const sign of signs) map.set(sign.category, (map.get(sign.category) ?? 0) + 1);
    return map;
  }, [signs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return signs.filter((sign) => {
      if (category !== 'all' && sign.category !== category) return false;
      if (!q) return true;
      return `${sign.name} ${sign.meaning}`.toLowerCase().includes(q);
    });
  }, [signs, query, category]);

  const available = SIGN_CATEGORIES.filter((c) => counts.get(c.id));

  return (
    <div className="container py-8 sm:py-10">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a sign by name or meaning…"
            aria-label="Search road signs"
            className="pl-9 pr-9"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-surface"
            >
              <X className="h-4 w-4" aria-hidden />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>

        <div className="-mx-4 overflow-x-auto px-4 no-scrollbar">
          <ul className="flex gap-2" role="tablist" aria-label="Sign categories">
            <li>
              <FilterChip
                active={category === 'all'}
                onClick={() => setCategory('all')}
                label="All signs"
                count={signs.length}
              />
            </li>
            {available.map((item) => (
              <li key={item.id}>
                <FilterChip
                  active={category === item.id}
                  onClick={() => setCategory(item.id)}
                  label={item.label}
                  sublabel={item.labelEn}
                  count={counts.get(item.id) ?? 0}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        Showing {filtered.length} of {signs.length} signs
        {category !== 'all' && ` in ${categoryLabel(category)} (${categoryLabelEn(category).toLowerCase()})`}.
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="font-medium text-foreground">No sign matches “{query}”.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a Kinyarwanda keyword such as <em>ntihanyurwa</em> or <em>tanga inzira</em>.
          </p>
        </div>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((sign) => (
            <li key={sign.id}>
              <Link
                href={`/signs/${sign.id}`}
                className="flex h-full flex-col items-center rounded-xl border border-border bg-card p-4 text-center shadow-card transition-shadow hover:shadow-lift"
              >
                <Image
                  src={sign.image}
                  alt={sign.name}
                  width={88}
                  height={88}
                  className="h-20 w-20 object-contain"
                />
                <span className="mt-3 text-sm font-medium leading-snug text-foreground">
                  {sign.name}
                </span>
                <Badge variant="outline" className="mt-2">
                  {categoryLabel(sign.category)}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  sublabel,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sublabel?: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-muted-foreground hover:bg-surface'
      )}
    >
      <span className="flex flex-col items-start leading-tight">
        {label}
        {sublabel && (
          <span
            className={cn(
              'text-[10px] font-normal',
              active ? 'text-primary-foreground/75' : 'text-muted-foreground'
            )}
          >
            {sublabel}
          </span>
        )}
      </span>
      <span className={cn('text-xs', active ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
        {count}
      </span>
    </button>
  );
}
