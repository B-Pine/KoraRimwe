'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Award, BookOpen, Clock, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { rankTopics } from '@/lib/exam';
import { useHydrated, useProgress } from '@/lib/store';
import { formatDuration, percentage } from '@/lib/utils';
import { questions } from '@/data/questions';
import { topics } from '@/data/topics';

const PASS = 'hsl(158 55% 27%)';
const FAIL = 'hsl(0 68% 42%)';

export function StatisticsClient() {
  const hydrated = useHydrated();
  const attempts = useProgress((s) => s.attempts);
  const topicStats = useProgress((s) => s.topicStats);
  const studiedTopics = useProgress((s) => s.studiedTopics);
  const studySeconds = useProgress((s) => s.studySeconds);
  const mastered = useProgress((s) => s.masteredQuestionIds);
  const incorrect = useProgress((s) => s.incorrectQuestionIds);
  const practiceAnswered = useProgress((s) => s.practiceAnswered);
  const practiceCorrect = useProgress((s) => s.practiceCorrect);
  const resetProgress = useProgress((s) => s.resetProgress);

  const ranked = useMemo(() => rankTopics(topicStats), [topicStats]);

  const trend = useMemo(
    () =>
      [...attempts]
        .reverse()
        .slice(-12)
        .map((attempt, index) => ({
          name: `#${index + 1}`,
          score: attempt.percentage,
          passed: attempt.passed,
        })),
    [attempts]
  );

  if (!hydrated) {
    return (
      <div className="container py-10">
        <p className="text-sm text-muted-foreground">Loading your statistics…</p>
      </div>
    );
  }

  const hasData = attempts.length > 0 || practiceAnswered > 0;

  if (!hasData) {
    return (
      <div className="container py-10">
        <Card className="border-dashed">
          <CardContent className="p-10 text-center">
            <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
            <h2 className="mt-4 text-lg font-semibold">No statistics yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Answer some practice questions or sit a mock exam, and this dashboard will show your
              scores, accuracy by topic and the areas that need work.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <Button asChild>
                <Link href="/practice">Practise questions</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/exams">Take a mock exam</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bestScore = attempts.length ? Math.max(...attempts.map((a) => a.percentage)) : 0;
  const averageScore = attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
    : 0;
  const covered = mastered.length + incorrect.length;

  const summary = [
    { icon: Target, label: 'Exams taken', value: String(attempts.length) },
    { icon: TrendingUp, label: 'Average score', value: `${averageScore}%` },
    { icon: Award, label: 'Best score', value: `${bestScore}%` },
    { icon: Clock, label: 'Study time', value: formatDuration(studySeconds) },
  ];

  return (
    <div className="container py-8 sm:py-10">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="p-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                  {item.label}
                </dt>
                <dd className="mt-2 font-display text-2xl font-bold sm:text-3xl">{item.value}</dd>
              </CardContent>
            </Card>
          );
        })}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h2 className="text-base font-semibold">Score history</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your last {trend.length} mock exam{trend.length === 1 ? '' : 's'}, oldest first.
            </p>

            {trend.length < 2 ? (
              <p className="mt-6 rounded-lg bg-surface p-6 text-center text-sm text-muted-foreground">
                Sit at least two mock exams to see a trend.
              </p>
            ) : (
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend} margin={{ top: 5, right: 8, bottom: 0, left: -24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(215 14% 40%)' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(215 14% 40%)' }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Score']}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid hsl(220 13% 91%)',
                        fontSize: 13,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={PASS}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: PASS }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="text-base font-semibold">Accuracy by topic</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Topics where you have answered at least three questions.
            </p>

            {ranked.length === 0 ? (
              <p className="mt-6 rounded-lg bg-surface p-6 text-center text-sm text-muted-foreground">
                Answer a few more questions to see this breakdown.
              </p>
            ) : (
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ranked.slice(0, 7)}
                    layout="vertical"
                    margin={{ top: 0, right: 12, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(215 14% 40%)' }}
                    />
                    <YAxis
                      type="category"
                      dataKey="title"
                      width={110}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: 'hsl(215 14% 40%)' }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Accuracy']}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid hsl(220 13% 91%)',
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="accuracy" radius={[0, 6, 6, 0]}>
                      {ranked.slice(0, 7).map((entry) => (
                        <Cell key={entry.slug} fill={entry.accuracy >= 70 ? PASS : FAIL} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <h2 className="text-base font-semibold">Completion</h2>

            <div className="mt-4 grid gap-4">
              <div>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-muted-foreground">Question bank seen</span>
                  <span className="font-medium">
                    {covered}/{questions.length}
                  </span>
                </div>
                <Progress value={percentage(covered, questions.length)} className="mt-1.5" />
              </div>

              <div>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-muted-foreground">Topics read</span>
                  <span className="font-medium">
                    {studiedTopics.length}/{topics.length}
                  </span>
                </div>
                <Progress value={percentage(studiedTopics.length, topics.length)} className="mt-1.5" />
              </div>

              <div>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-muted-foreground">Practice accuracy</span>
                  <span className="font-medium">
                    {percentage(practiceCorrect, practiceAnswered)}%
                  </span>
                </div>
                <Progress
                  value={percentage(practiceCorrect, practiceAnswered)}
                  className="mt-1.5"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="text-base font-semibold text-destructive">Weakest topics</h2>
                {ranked.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">Not enough answers yet.</p>
                ) : (
                  <ul className="mt-3 grid gap-2">
                    {ranked.slice(0, 3).map((topic) => (
                      <li key={topic.slug} className="flex items-center justify-between gap-3 text-sm">
                        <Link href={`/study/${topic.slug}`} className="truncate hover:text-primary">
                          {topic.title}
                        </Link>
                        <span className="shrink-0 font-medium tabular-nums">{topic.accuracy}%</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h2 className="text-base font-semibold text-primary">Strongest topics</h2>
                {ranked.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">Not enough answers yet.</p>
                ) : (
                  <ul className="mt-3 grid gap-2">
                    {[...ranked]
                      .reverse()
                      .slice(0, 3)
                      .map((topic) => (
                        <li
                          key={topic.slug}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <Link href={`/study/${topic.slug}`} className="truncate hover:text-primary">
                            {topic.title}
                          </Link>
                          <span className="shrink-0 font-medium tabular-nums">{topic.accuracy}%</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 border-t border-border pt-5 sm:flex-row">
              <Button asChild variant="outline" className="sm:w-auto">
                <Link href="/revision">
                  <BookOpen className="h-4 w-4" aria-hidden />
                  Go to revision centre
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="text-destructive hover:bg-destructive/5 hover:text-destructive sm:ml-auto sm:w-auto"
                onClick={() => {
                  if (
                    window.confirm(
                      'Erase all your progress on this device? Exam history, statistics and saved questions will be deleted. This cannot be undone.'
                    )
                  ) {
                    resetProgress();
                  }
                }}
              >
                Reset all progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
