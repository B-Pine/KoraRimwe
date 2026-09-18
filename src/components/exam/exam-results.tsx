'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { topicTitle } from '@/lib/exam';
import { cn, formatDuration, percentage } from '@/lib/utils';
import type { ExamAttempt, ExamBlueprint, Question } from '@/types';

export function ExamResults({
  attempt,
  paper,
  blueprint,
  onRetake,
}: {
  attempt: ExamAttempt;
  paper: Question[];
  blueprint: ExamBlueprint;
  onRetake: () => void;
}) {
  const wrong = paper.filter((_, i) => !attempt.answers[i].correct);

  const weakTopics = Object.entries(attempt.topicBreakdown)
    .map(([slug, value]) => ({
      slug,
      title: topicTitle(slug),
      accuracy: percentage(value.correct, value.total),
      ...value,
    }))
    .filter((t) => t.accuracy < 100)
    .sort((a, b) => a.accuracy - b.accuracy);

  return (
    <div className="container max-w-3xl py-8 sm:py-12">
      <Card className={cn('border-2', attempt.passed ? 'border-primary' : 'border-destructive')}>
        <CardContent className="p-6 text-center sm:p-8">
          <span
            className={cn(
              'inline-flex h-16 w-16 items-center justify-center rounded-full',
              attempt.passed ? 'bg-secondary text-primary' : 'bg-destructive/10 text-destructive'
            )}
          >
            {attempt.passed ? (
              <CheckCircle2 className="h-9 w-9" aria-hidden />
            ) : (
              <XCircle className="h-9 w-9" aria-hidden />
            )}
          </span>

          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
            {attempt.passed ? 'Watsinze — you passed' : 'Ntabwo watsinze — not yet'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {blueprint.name} · {formatDuration(attempt.durationSeconds)} taken
          </p>

          <p className="mt-6 font-display text-5xl font-bold text-foreground">
            {attempt.score}
            <span className="text-2xl text-muted-foreground">/{attempt.total}</span>
          </p>
          <p className="mt-1 text-lg font-semibold text-primary">{attempt.percentage}%</p>

          <Progress
            value={attempt.percentage}
            className="mx-auto mt-5 max-w-sm"
            indicatorClassName={attempt.passed ? 'bg-primary' : 'bg-destructive'}
            aria-label="Score"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Pass mark: {blueprint.passMark} of {blueprint.questionCount} correct
          </p>

          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={onRetake}>
              <RotateCcw className="h-4 w-4" aria-hidden />
              Take another paper
            </Button>
            <Button asChild variant="outline">
              <Link href="/revision">Revise my mistakes</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {weakTopics.length > 0 && (
        <section className="mt-8" aria-labelledby="weak-heading">
          <h2 id="weak-heading" className="text-lg font-bold">
            Suggested study areas
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on this paper, these topics need the most work.
          </p>
          <ul className="mt-4 grid gap-3">
            {weakTopics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/study/${topic.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-card"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{topic.title}</p>
                    <Progress value={topic.accuracy} className="mt-2 h-1.5" />
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
                    {topic.correct}/{topic.total}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10" aria-labelledby="review-heading">
        <h2 id="review-heading" className="text-lg font-bold">
          Review {wrong.length > 0 ? `· ${wrong.length} incorrect` : '· all correct'}
        </h2>

        <ul className="mt-4 grid gap-4">
          {paper.map((question, i) => {
            const answer = attempt.answers[i];
            const skipped = answer.selected === null;
            return (
              <li key={question.id}>
                <Card className={cn(!answer.correct && 'border-destructive/40')}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2">
                      <Badge variant={answer.correct ? 'success' : 'danger'}>
                        {answer.correct ? 'Correct' : skipped ? 'Not answered' : 'Incorrect'}
                      </Badge>
                      <Badge variant="outline">{topicTitle(question.topicSlug)}</Badge>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {i + 1}/{paper.length}
                      </span>
                    </div>

                    {question.image && (
                      <div className="mt-4 flex justify-center rounded-lg bg-surface p-4">
                        <Image
                          src={question.image}
                          alt=""
                          width={96}
                          height={96}
                          className="h-20 w-auto object-contain"
                        />
                      </div>
                    )}

                    <p className="mt-3 text-sm font-semibold leading-6">{question.prompt}</p>

                    {!answer.correct && !skipped && (
                      <p className="mt-3 rounded-lg bg-destructive/5 p-3 text-sm leading-6 text-destructive">
                        <span className="font-medium">Your answer: </span>
                        {question.options[answer.selected!]}
                      </p>
                    )}

                    <p className="mt-2 rounded-lg bg-secondary p-3 text-sm leading-6 text-secondary-foreground">
                      <span className="font-medium">Igisubizo nyacyo: </span>
                      {question.options[question.answer]}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Source {question.sourceRef}
                      {' · '}
                      <Link
                        href={`/study/${question.topicSlug}`}
                        className="text-primary hover:underline"
                      >
                        Study this topic
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
