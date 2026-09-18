'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, CircleAlert, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useHydrated, useProgress } from '@/lib/store';
import { percentage } from '@/lib/utils';

/**
 * Shows a learner's standing once they have done something; before that it
 * explains how the platform works rather than showing empty zeroes.
 */
export function ContinueCard({ totalQuestions }: { totalQuestions: number }) {
  const hydrated = useHydrated();
  const attempts = useProgress((s) => s.attempts);
  const incorrect = useProgress((s) => s.incorrectQuestionIds);
  const mastered = useProgress((s) => s.masteredQuestionIds);

  const started = hydrated && (attempts.length > 0 || mastered.length > 0 || incorrect.length > 0);
  const covered = mastered.length + incorrect.length;
  const bestScore = attempts.length ? Math.max(...attempts.map((a) => a.percentage)) : 0;

  if (!started) {
    return (
      <Card className="shadow-lift">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="mt-4 grid gap-4">
            {[
              { title: 'Read a topic', body: 'Definitions and verified facts, one subject at a time.' },
              { title: 'Practise freely', body: 'Answer with instant feedback and no timer.' },
              { title: 'Sit a mock exam', body: 'Timed paper, automatic score, full review.' },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                  {index + 1}
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">{step.title}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
          <Button asChild className="mt-6 w-full">
            <Link href="/practice">
              Try a question
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lift">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold">Your progress</h2>

        <div className="mt-5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-foreground">Question bank covered</span>
            <span className="text-muted-foreground">
              {covered} / {totalQuestions}
            </span>
          </div>
          <Progress
            value={percentage(covered, totalQuestions)}
            className="mt-2"
            aria-label="Question bank covered"
          />
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-surface p-3">
            <dt className="sr-only">Exams taken</dt>
            <TrendingUp className="mx-auto h-4 w-4 text-primary" aria-hidden />
            <dd className="mt-1 font-display text-xl font-bold">{attempts.length}</dd>
            <p className="text-[11px] text-muted-foreground">Exams</p>
          </div>
          <div className="rounded-lg bg-surface p-3">
            <dt className="sr-only">Best score</dt>
            <CheckCircle2 className="mx-auto h-4 w-4 text-primary" aria-hidden />
            <dd className="mt-1 font-display text-xl font-bold">{bestScore}%</dd>
            <p className="text-[11px] text-muted-foreground">Best</p>
          </div>
          <div className="rounded-lg bg-surface p-3">
            <dt className="sr-only">Questions to revise</dt>
            <CircleAlert className="mx-auto h-4 w-4 text-destructive" aria-hidden />
            <dd className="mt-1 font-display text-xl font-bold">{incorrect.length}</dd>
            <p className="text-[11px] text-muted-foreground">To revise</p>
          </div>
        </dl>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button asChild>
            <Link href="/exams">Take mock exam</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/revision">Revise mistakes</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
