'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuestionCard } from '@/components/practice/question-card';
import { questions } from '@/data/questions';
import { rankTopics } from '@/lib/exam';
import { useHydrated, useProgress } from '@/lib/store';
import { shuffle } from '@/lib/utils';

export function RevisionClient() {
  const hydrated = useHydrated();
  const incorrectIds = useProgress((s) => s.incorrectQuestionIds);
  const bookmarkedIds = useProgress((s) => s.bookmarkedQuestionIds);
  const topicStats = useProgress((s) => s.topicStats);

  const [mode, setMode] = useState<'mistakes' | 'saved' | null>(null);
  const [cursor, setCursor] = useState(0);

  const weakTopics = useMemo(() => rankTopics(topicStats).slice(0, 4), [topicStats]);

  const session = useMemo(() => {
    if (!mode) return [];
    const ids = mode === 'mistakes' ? incorrectIds : bookmarkedIds;
    return shuffle(questions.filter((q) => ids.includes(q.id)));
    // Session is fixed once started: re-shuffling as answers change would be jarring.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  if (!hydrated) {
    return (
      <div className="container py-10">
        <p className="text-sm text-muted-foreground">Loading your progress…</p>
      </div>
    );
  }

  if (mode) {
    const current = session[cursor];
    return (
      <div className="container max-w-3xl py-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">
              {mode === 'mistakes' ? 'Retrying your mistakes' : 'Saved questions'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {session.length} question{session.length === 1 ? '' : 's'} in this session
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setMode(null);
              setCursor(0);
            }}
          >
            End session
          </Button>
        </div>

        <Progress
          value={session.length ? (Math.min(cursor, session.length) / session.length) * 100 : 0}
          className="mb-5"
          aria-label="Session progress"
        />

        {!current ? (
          <Card>
            <CardContent className="p-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold">Session complete</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Anything you answered correctly has been cleared from your mistakes list.
              </p>
              <Button
                className="mt-5"
                onClick={() => {
                  setMode(null);
                  setCursor(0);
                }}
              >
                Back to revision centre
              </Button>
            </CardContent>
          </Card>
        ) : (
          <QuestionCard
            key={current.id}
            question={current}
            index={cursor}
            total={session.length}
            source="revision"
            onNext={() => setCursor((value) => value + 1)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="container py-8 sm:py-10">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-destructive/30">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold">Questions you got wrong</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every question you answered incorrectly, in practice or in an exam, waits here until
              you answer it correctly.
            </p>
            <p className="mt-4 font-display text-4xl font-bold text-destructive">
              {incorrectIds.length}
            </p>
            <Button
              className="mt-4 w-full"
              disabled={incorrectIds.length === 0}
              onClick={() => {
                setMode('mistakes');
                setCursor(0);
              }}
            >
              {incorrectIds.length === 0 ? 'Nothing to revise' : 'Start revision session'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold">Saved questions</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Questions you bookmarked while practising, ready to review whenever you like.
            </p>
            <p className="mt-4 font-display text-4xl font-bold text-primary">
              {bookmarkedIds.length}
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              disabled={bookmarkedIds.length === 0}
              onClick={() => {
                setMode('saved');
                setCursor(0);
              }}
            >
              {bookmarkedIds.length === 0 ? 'Nothing saved yet' : 'Review saved questions'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="mt-10" aria-labelledby="recommend-heading">
        <h2 id="recommend-heading" className="flex items-center gap-2 text-lg font-bold">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden />
          Recommended topics
        </h2>

        {weakTopics.length === 0 ? (
          <Card className="mt-4 border-dashed">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Answer at least three questions in a topic and your weakest areas will appear here.
              </p>
              <Button asChild className="mt-4">
                <Link href="/practice">Start practising</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="mt-4 grid gap-3">
            {weakTopics.map((topic) => (
              <li key={topic.slug}>
                <Card>
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{topic.title}</p>
                        <Badge variant={topic.accuracy < 60 ? 'danger' : 'outline'}>
                          {topic.accuracy}%
                        </Badge>
                      </div>
                      <Progress value={topic.accuracy} className="mt-2 h-1.5" />
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {topic.correct} correct of {topic.attempted} answered
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/study/${topic.slug}`}>
                          <BookOpen className="h-4 w-4" aria-hidden />
                          Study
                        </Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href={`/practice?topic=${topic.slug}`}>Practise</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
