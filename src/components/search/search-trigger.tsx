'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ListChecks, Search, Signpost } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { search, type SearchKind, type SearchResult } from '@/lib/search';
import { cn } from '@/lib/utils';

const KIND_ICON: Record<SearchKind, typeof BookOpen> = {
  topic: BookOpen,
  sign: Signpost,
  question: ListChecks,
};

const KIND_LABEL: Record<SearchKind, string> = {
  topic: 'Study topic',
  sign: 'Road sign',
  question: 'Question',
};

export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Ctrl/Cmd+K opens search from anywhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const results = useMemo(() => search(query), [query]);

  const go = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    router.push(result.href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-surface focus-visible:ring-2 focus-visible:ring-ring sm:w-64"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <span className="hidden sm:inline">Search topics, signs, questions</span>
        <span className="sr-only sm:hidden">Search</span>
        <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-[10px] font-medium sm:inline">
          Ctrl K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[12%] max-w-xl translate-y-0 gap-3 p-4" hideClose>
          <DialogTitle className="sr-only">Search KoraRimwe</DialogTitle>
          <DialogDescription className="sr-only">
            Search study topics, road signs and exam questions.
          </DialogDescription>

          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search rules, signs or questions…"
            aria-label="Search"
          />

          <div className="max-h-[55vh] overflow-y-auto" role="listbox" aria-label="Search results">
            {query.trim().length < 2 ? (
              <p className="px-1 py-6 text-center text-sm text-muted-foreground">
                Type at least two letters. Try <em>umuvuduko</em>, <em>STOP</em> or <em>parking</em>.
              </p>
            ) : results.length === 0 ? (
              <p className="px-1 py-6 text-center text-sm text-muted-foreground">
                Nothing found for “{query}”.
              </p>
            ) : (
              <ul className="grid gap-1">
                {results.map((result) => {
                  const Icon = KIND_ICON[result.kind];
                  return (
                    <li key={`${result.kind}-${result.id}`}>
                      <button
                        type="button"
                        onClick={() => go(result)}
                        className="flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none"
                      >
                        {result.image ? (
                          <Image
                            src={result.image}
                            alt=""
                            width={32}
                            height={32}
                            className="mt-0.5 h-8 w-8 shrink-0 object-contain"
                          />
                        ) : (
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {result.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            <span className={cn('font-medium text-primary')}>
                              {KIND_LABEL[result.kind]}
                            </span>
                            {' · '}
                            {result.subtitle}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
