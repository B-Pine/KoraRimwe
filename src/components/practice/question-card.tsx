'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Bookmark, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { topicTitle } from '@/lib/exam';
import { useProgress } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { Question } from '@/types';

const DIFFICULTY_LABEL: Record<Question['difficulty'], string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

/**
 * A single question with instant feedback. Used by Practice and by the
 * Revision Centre; the exam runner has its own deferred-feedback UI.
 */
export function QuestionCard({
  question,
  index,
  total,
  onNext,
  source = 'practice',
}: {
  question: Question;
  index: number;
  total: number;
  onNext: () => void;
  source?: 'practice' | 'revision';
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const toggleBookmark = useProgress((s) => s.toggleBookmark);
  const bookmarked = useProgress((s) => s.bookmarkedQuestionIds.includes(question.id));

  // Reset when the question changes.
  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
  }, [question.id]);

  const correct = submitted && selected === question.answer;

  const submit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    recordAnswer({
      questionId: question.id,
      topicSlug: question.topicSlug,
      correct: selected === question.answer,
      source,
    });
  };

  return (
    <Card className="shadow-card">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            Question {index + 1} of {total}
          </Badge>
          <Badge variant="outline">{topicTitle(question.topicSlug)}</Badge>
          <Badge variant="outline">{DIFFICULTY_LABEL[question.difficulty]}</Badge>
          <button
            type="button"
            onClick={() => toggleBookmark(question.id)}
            aria-pressed={bookmarked}
            className={cn(
              'ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors',
              bookmarked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current')} aria-hidden />
            {bookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        {question.image && (
          <div className="mt-5 flex justify-center rounded-xl bg-surface p-5">
            <Image
              src={question.image}
              alt="Road sign for this question"
              width={160}
              height={160}
              className="h-32 w-auto object-contain sm:h-40"
              priority={index === 0}
            />
          </div>
        )}

        <h2 className="mt-5 text-lg font-semibold leading-7">{question.prompt}</h2>

        <fieldset className="mt-5" disabled={submitted}>
          <legend className="sr-only">Choose one answer</legend>
          <ul className="grid gap-2.5">
            {question.options.map((option, optionIndex) => {
              const isChosen = selected === optionIndex;
              const isAnswer = optionIndex === question.answer;
              const showCorrect = submitted && isAnswer;
              const showWrong = submitted && isChosen && !isAnswer;

              return (
                <li key={optionIndex}>
                  <label
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors',
                      !submitted && 'hover:border-primary hover:bg-secondary/40',
                      !submitted && isChosen && 'border-primary bg-secondary',
                      showCorrect && 'border-primary bg-secondary',
                      showWrong && 'border-destructive bg-destructive/5',
                      submitted && !showCorrect && !showWrong && 'opacity-60'
                    )}
                  >
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      value={optionIndex}
                      checked={isChosen}
                      onChange={() => setSelected(optionIndex)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold uppercase',
                        showCorrect && 'border-primary bg-primary text-primary-foreground',
                        showWrong && 'border-destructive bg-destructive text-destructive-foreground',
                        !submitted && isChosen && 'border-primary bg-primary text-primary-foreground',
                        !submitted && !isChosen && 'border-border text-muted-foreground'
                      )}
                      aria-hidden
                    >
                      {showCorrect ? (
                        <Check className="h-3 w-3" />
                      ) : showWrong ? (
                        <X className="h-3 w-3" />
                      ) : (
                        String.fromCharCode(97 + optionIndex)
                      )}
                    </span>
                    <span className="text-sm leading-6 text-foreground">{option}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        {submitted && (
          <div
            role="status"
            className={cn(
              'mt-5 rounded-lg border p-4',
              correct ? 'border-primary/30 bg-secondary' : 'border-destructive/30 bg-destructive/5'
            )}
          >
            <p
              className={cn(
                'text-sm font-semibold',
                correct ? 'text-secondary-foreground' : 'text-destructive'
              )}
            >
              {correct ? 'Correct — nibyo!' : 'Not quite.'}
            </p>
            <p className="mt-1.5 text-sm leading-6 text-foreground">
              <span className="font-medium">Igisubizo nyacyo: </span>
              {question.options[question.answer]}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Source {question.sourceRef}
              {question.signId && (
                <>
                  {' · '}
                  <Link href={`/signs/${question.signId}`} className="text-primary hover:underline">
                    View this sign
                  </Link>
                </>
              )}
              {' · '}
              <Link href={`/study/${question.topicSlug}`} className="text-primary hover:underline">
                Study {topicTitle(question.topicSlug)}
              </Link>
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {!submitted ? (
            <Button onClick={submit} disabled={selected === null} size="lg">
              Submit answer
            </Button>
          ) : (
            <Button onClick={onNext} size="lg">
              Next question
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
