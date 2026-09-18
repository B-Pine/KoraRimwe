'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Filter, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuestionCard } from '@/components/practice/question-card';
import { questions } from '@/data/questions';
import { topics } from '@/data/topics';
import { useHydrated, useProgress } from '@/lib/store';
import { cn, percentage, shuffle } from '@/lib/utils';
import type { Difficulty } from '@/types';

const DIFFICULTIES: { id: Difficulty | 'all'; label: string }[] = [
  { id: 'all', label: 'All levels' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

export function PracticeClient() {
  const searchParams = useSearchParams();
  const hydrated = useHydrated();
  const incorrectIds = useProgress((s) => s.incorrectQuestionIds);

  const [topic, setTopic] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [onlyMistakes, setOnlyMistakes] = useState(false);
  const [randomMode, setRandomMode] = useState(true);
  const [cursor, setCursor] = useState(0);
  const [seed, setSeed] = useState(1);

  // Deep links from study pages (?topic=) and search (?question=).
  useEffect(() => {
    const requestedTopic = searchParams.get('topic');
    if (requestedTopic) setTopic(requestedTopic);
  }, [searchParams]);

  const requestedQuestion = searchParams.get('question');

  const pool = useMemo(() => {
    let list = questions.filter((q) => {
      if (topic !== 'all' && q.topicSlug !== topic) return false;
      if (difficulty !== 'all' && q.difficulty !== difficulty) return false;
      if (onlyMistakes && !incorrectIds.includes(q.id)) return false;
      return true;
    });

    if (requestedQuestion) {
      const pinned = questions.find((q) => q.id === requestedQuestion);
      if (pinned) list = [pinned, ...list.filter((q) => q.id !== pinned.id)];
      return list;
    }

    return randomMode ? shuffle(list, seed) : list;
  }, [topic, difficulty, onlyMistakes, incorrectIds, randomMode, seed, requestedQuestion]);

  // Keep the cursor inside the pool when filters change.
  useEffect(() => {
    setCursor(0);
  }, [topic, difficulty, onlyMistakes, randomMode, seed]);

  const current = pool[cursor];
  const answeredInSession = Math.min(cursor, pool.length);

  return (
    <div className="container py-8 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Filter className="h-4 w-4 text-primary" aria-hidden />
                Filters
              </h2>

              <div className="mt-4">
                <label htmlFor="topic-filter" className="text-xs font-medium text-muted-foreground">
                  Topic
                </label>
                <select
                  id="topic-filter"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">All topics ({questions.length})</option>
                  {topics.map((t) => {
                    const count = questions.filter((q) => q.topicSlug === t.slug).length;
                    return (
                      <option key={t.slug} value={t.slug}>
                        {t.title} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground">Difficulty</p>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {DIFFICULTIES.map((level) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setDifficulty(level.id)}
                      aria-pressed={difficulty === level.id}
                      className={cn(
                        'rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors',
                        difficulty === level.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-muted-foreground hover:bg-surface'
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3 border-t border-border pt-4">
                <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
                  <span className="text-foreground">Random order</span>
                  <input
                    type="checkbox"
                    checked={randomMode}
                    onChange={(event) => setRandomMode(event.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
                  <span className="text-foreground">
                    Only my mistakes
                    {hydrated && (
                      <span className="ml-1 text-muted-foreground">({incorrectIds.length})</span>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={onlyMistakes}
                    onChange={(event) => setOnlyMistakes(event.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              </div>

              <Button
                variant="outline"
                className="mt-5 w-full"
                onClick={() => setSeed((value) => value + 1)}
              >
                <Shuffle className="h-4 w-4" aria-hidden />
                Reshuffle
              </Button>
            </CardContent>
          </Card>
        </aside>

        <div>
          <div className="mb-4">
            <div className="flex items-baseline justify-between text-sm">
              <p className="font-medium text-foreground">
                {pool.length} question{pool.length === 1 ? '' : 's'} in this set
              </p>
              <p className="text-muted-foreground">
                {answeredInSession} / {pool.length}
              </p>
            </div>
            <Progress
              value={percentage(answeredInSession, pool.length)}
              className="mt-2"
              aria-label="Progress through this set"
            />
          </div>

          {!current ? (
            <Card>
              <CardContent className="p-10 text-center">
                <h2 className="text-lg font-semibold">
                  {pool.length === 0 ? 'No questions match these filters' : 'Set complete'}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {pool.length === 0
                    ? 'Try a different topic or turn off “Only my mistakes”.'
                    : 'You have worked through every question in this set.'}
                </p>
                <Button className="mt-5" onClick={() => setCursor(0)}>
                  Start again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <QuestionCard
              key={current.id}
              question={current}
              index={cursor}
              total={pool.length}
              onNext={() => setCursor((value) => value + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
