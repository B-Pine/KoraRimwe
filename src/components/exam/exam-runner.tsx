'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Clock, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExamResults } from '@/components/exam/exam-results';
import { generateExam, scoreExam } from '@/lib/exam';
import { useProgress } from '@/lib/store';
import { cn, formatSeconds, percentage } from '@/lib/utils';
import type { ExamAttempt, ExamBlueprint, Question } from '@/types';

type Phase = 'briefing' | 'running' | 'finished';

export function ExamRunner({ blueprint }: { blueprint: ExamBlueprint }) {
  const [phase, setPhase] = useState<Phase>('briefing');
  const [paper, setPaper] = useState<Question[]>([]);
  const [selections, setSelections] = useState<Record<string, number | null>>({});
  const [cursor, setCursor] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(blueprint.durationMinutes * 60);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);

  const startedAt = useRef(0);
  const recordAttempt = useProgress((s) => s.recordAttempt);
  const recordAnswer = useProgress((s) => s.recordAnswer);

  const finish = useCallback(() => {
    if (phase !== 'running') return;
    const finishedAt = Date.now();
    const result = scoreExam(blueprint, paper, selections, startedAt.current, finishedAt);

    recordAttempt(result);
    // Feed the revision engine: every question counts towards topic accuracy.
    paper.forEach((question, i) => {
      recordAnswer({
        questionId: question.id,
        topicSlug: question.topicSlug,
        correct: result.answers[i].correct,
        source: 'exam',
      });
    });

    setAttempt(result);
    setPhase('finished');
    setConfirmSubmit(false);
  }, [blueprint, paper, phase, recordAnswer, recordAttempt, selections]);

  // Countdown. Submitting automatically when time runs out is part of the simulation.
  useEffect(() => {
    if (phase !== 'running') return;
    const timer = setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && secondsLeft === 0) finish();
  }, [phase, secondsLeft, finish]);

  // Warn before a refresh or tab close loses the paper.
  useEffect(() => {
    if (phase !== 'running') return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [phase]);

  const start = () => {
    const generated = generateExam(blueprint);
    setPaper(generated);
    setSelections({});
    setCursor(0);
    setSecondsLeft(blueprint.durationMinutes * 60);
    startedAt.current = Date.now();
    setPhase('running');
  };

  const answeredCount = useMemo(
    () => Object.values(selections).filter((value) => value !== null && value !== undefined).length,
    [selections]
  );

  if (phase === 'briefing') {
    return <Briefing blueprint={blueprint} onStart={start} />;
  }

  if (phase === 'finished' && attempt) {
    return <ExamResults attempt={attempt} paper={paper} blueprint={blueprint} onRetake={start} />;
  }

  const question = paper[cursor];
  const lowTime = secondsLeft <= 60;

  return (
    <div className="container max-w-3xl py-6 sm:py-8">
      <div className="sticky top-16 z-30 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{blueprint.name}</p>
            <p className="text-xs text-muted-foreground">
              Question {cursor + 1} of {paper.length} · {answeredCount} answered
            </p>
          </div>

          <div
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-1.5 font-display text-lg font-bold tabular-nums',
              lowTime ? 'bg-destructive/10 text-destructive' : 'bg-surface text-foreground'
            )}
            role="timer"
            aria-live={lowTime ? 'assertive' : 'off'}
          >
            <Clock className="h-4 w-4" aria-hidden />
            {formatSeconds(secondsLeft)}
            <span className="sr-only">remaining</span>
          </div>
        </div>

        <Progress
          value={percentage(cursor + 1, paper.length)}
          className="mt-3 h-1.5"
          aria-label="Exam progress"
        />
      </div>

      <Card className="mt-5">
        <CardContent className="p-5 sm:p-6">
          {question.image && (
            <div className="mb-5 flex justify-center rounded-xl bg-surface p-5">
              <Image
                src={question.image}
                alt="Road sign for this question"
                width={160}
                height={160}
                className="h-32 w-auto object-contain sm:h-40"
              />
            </div>
          )}

          <h2 className="text-lg font-semibold leading-7">{question.prompt}</h2>

          <fieldset className="mt-5">
            <legend className="sr-only">Choose one answer</legend>
            <ul className="grid gap-2.5">
              {question.options.map((option, optionIndex) => {
                const chosen = selections[question.id] === optionIndex;
                return (
                  <li key={optionIndex}>
                    <label
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors',
                        chosen
                          ? 'border-primary bg-secondary'
                          : 'border-border hover:border-primary hover:bg-secondary/40'
                      )}
                    >
                      <input
                        type="radio"
                        name={`exam-${question.id}`}
                        checked={chosen}
                        onChange={() =>
                          setSelections((prev) => ({ ...prev, [question.id]: optionIndex }))
                        }
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold',
                          chosen
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border text-muted-foreground'
                        )}
                        aria-hidden
                      >
                        {String.fromCharCode(97 + optionIndex)}
                      </span>
                      <span className="text-sm leading-6">{option}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setCursor((value) => Math.max(0, value - 1))}
              disabled={cursor === 0}
            >
              Previous
            </Button>

            {cursor === paper.length - 1 ? (
              <Button onClick={() => setConfirmSubmit(true)}>
                <Flag className="h-4 w-4" aria-hidden />
                Submit exam
              </Button>
            ) : (
              <Button onClick={() => setCursor((value) => Math.min(paper.length - 1, value + 1))}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <section className="mt-6" aria-labelledby="navigator-heading">
        <h2 id="navigator-heading" className="text-sm font-semibold">
          Question navigator
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {paper.map((item, itemIndex) => {
            const answered = selections[item.id] !== undefined && selections[item.id] !== null;
            const active = itemIndex === cursor;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setCursor(itemIndex)}
                  aria-current={active ? 'true' : undefined}
                  aria-label={`Question ${itemIndex + 1}${answered ? ', answered' : ', not answered'}`}
                  className={cn(
                    'h-9 w-9 rounded-lg border text-sm font-medium transition-colors',
                    active && 'ring-2 ring-ring ring-offset-2',
                    answered
                      ? 'border-primary bg-secondary text-secondary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:bg-surface'
                  )}
                >
                  {itemIndex + 1}
                </button>
              </li>
            );
          })}
        </ul>

        <Button variant="outline" className="mt-5" onClick={() => setConfirmSubmit(true)}>
          Finish and submit
        </Button>
      </section>

      <Dialog open={confirmSubmit} onOpenChange={setConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit this exam?</DialogTitle>
            <DialogDescription>
              {answeredCount < paper.length ? (
                <span className="flex items-start gap-2 text-destructive">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {paper.length - answeredCount} question
                  {paper.length - answeredCount === 1 ? ' is' : 's are'} still unanswered and will be
                  marked wrong.
                </span>
              ) : (
                'You have answered every question. Your paper will be marked immediately.'
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmSubmit(false)}>
              Keep working
            </Button>
            <Button onClick={finish}>Submit exam</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Briefing({ blueprint, onStart }: { blueprint: ExamBlueprint; onStart: () => void }) {
  return (
    <div className="container max-w-2xl py-10 sm:py-14">
      <Card>
        <CardContent className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold">{blueprint.name}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{blueprint.description}</p>

          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Questions', value: blueprint.questionCount },
              { label: 'Minutes', value: blueprint.durationMinutes },
              { label: 'To pass', value: `${blueprint.passMark}/${blueprint.questionCount}` },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-surface p-4">
                <dt className="text-xs text-muted-foreground">{item.label}</dt>
                <dd className="mt-1 font-display text-2xl font-bold text-primary">{item.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-6 grid gap-2 text-sm leading-6 text-muted-foreground">
            <li>• The timer starts as soon as you begin and submits your paper when it reaches zero.</li>
            <li>• You may move between questions freely and change any answer before submitting.</li>
            <li>• Answers are only revealed after you submit, exactly as in the real exam.</li>
            <li>• Leaving this page ends the attempt, so sit it in one go.</li>
          </ul>

          <Button size="lg" className="mt-8 w-full" onClick={onStart}>
            Start exam
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
