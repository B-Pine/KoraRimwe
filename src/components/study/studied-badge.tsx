'use client';

import { CheckCircle2 } from 'lucide-react';
import { useHydrated, useProgress } from '@/lib/store';

/** Marks topics the learner has already opened. Silent until hydrated. */
export function StudiedBadge({ slug }: { slug: string }) {
  const hydrated = useHydrated();
  const studied = useProgress((s) => s.studiedTopics.includes(slug));

  if (!hydrated || !studied) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
      <CheckCircle2 className="h-3 w-3" aria-hidden />
      Read
    </span>
  );
}
