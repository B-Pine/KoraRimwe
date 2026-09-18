import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, ListChecks, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { AttemptHistory } from '@/components/exam/attempt-history';
import { Badge } from '@/components/ui/badge';
import { examBlueprints, isOfficialFormat } from '@/data/exams';

export const metadata: Metadata = {
  title: 'Mock Exams',
  description:
    'Sit timed mock exams for the Rwandan driving theory test. Randomised papers, automatic scoring, a pass mark and a full review of every mistake.',
};

export default function ExamsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mock exams"
        title="Ibizamini — exam simulation"
        description="The police theory examination is a set of 20 questions. Papers marked “official format” follow that shape exactly, and each one is generated fresh from the question bank so you never sit the same exam twice."
      />

      <div className="container py-8 sm:py-10">
        <ul className="grid gap-4 sm:grid-cols-2">
          {examBlueprints.map((blueprint) => (
            <li key={blueprint.id}>
              <Card className="relative h-full transition-shadow hover:shadow-lift">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold">
                      <Link href={`/exams/${blueprint.id}`} className="after:absolute after:inset-0">
                        {blueprint.name}
                      </Link>
                    </h2>
                    {isOfficialFormat(blueprint) && (
                      <Badge variant="solid" className="shrink-0">
                        Official format
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                    {blueprint.description}
                  </p>

                  <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ListChecks className="h-4 w-4 text-primary" aria-hidden />
                      <dt className="sr-only">Questions</dt>
                      <dd>{blueprint.questionCount} questions</dd>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" aria-hidden />
                      <dt className="sr-only">Duration</dt>
                      <dd>{blueprint.durationMinutes} minutes</dd>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Target className="h-4 w-4 text-primary" aria-hidden />
                      <dt className="sr-only">Pass mark</dt>
                      <dd>{blueprint.passMark} to pass</dd>
                    </div>
                  </dl>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Start paper
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <AttemptHistory />
      </div>
    </>
  );
}
