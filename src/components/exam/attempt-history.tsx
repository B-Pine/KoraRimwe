'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useHydrated, useProgress } from '@/lib/store';
import { formatDate, formatDuration } from '@/lib/utils';

export function AttemptHistory() {
  const hydrated = useHydrated();
  const attempts = useProgress((s) => s.attempts);

  if (!hydrated || attempts.length === 0) return null;

  const passed = attempts.filter((a) => a.passed).length;

  return (
    <section className="mt-10" aria-labelledby="history-heading">
      <h2 id="history-heading" className="text-lg font-bold">
        Your recent papers
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {passed} passed out of {attempts.length} sat.
      </p>

      <Card className="mt-4">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Mock exam attempts, newest first</caption>
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-medium">Paper</th>
                  <th scope="col" className="px-4 py-3 font-medium">Date</th>
                  <th scope="col" className="px-4 py-3 font-medium">Time</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Score</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 10).map((attempt) => (
                  <tr key={attempt.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{attempt.blueprintName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(attempt.finishedAt)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDuration(attempt.durationSeconds)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-foreground">
                      {attempt.score}/{attempt.total} · {attempt.percentage}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant={attempt.passed ? 'success' : 'danger'}>
                        {attempt.passed ? 'Pass' : 'Fail'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
