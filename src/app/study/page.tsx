import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { StudiedBadge } from '@/components/study/studied-badge';
import { topics } from '@/data/topics';
import { questions } from '@/data/questions';

export const metadata: Metadata = {
  title: 'Study',
  description:
    'Eleven study topics covering Rwanda road rules: statutory definitions and verified exam facts, quoted from the official Amategeko y’Umuhanda books.',
};

export default function StudyPage() {
  const countFor = (slug: string) => questions.filter((q) => q.topicSlug === slug).length;

  return (
    <>
      <PageHeader
        eyebrow="Study"
        title="Learn the road rules"
        description="Each topic gives you the statutory definitions in Kinyarwanda and the facts the examination actually tests, with the source question number so you can check anything yourself."
      />

      <div className="container py-8 sm:py-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <li key={topic.slug}>
              <Card className="relative h-full transition-shadow hover:shadow-lift">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <BookOpen className="h-4 w-4" aria-hidden />
                    </span>
                    <StudiedBadge slug={topic.slug} />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold leading-snug">
                    <Link href={`/study/${topic.slug}`} className="after:absolute after:inset-0">
                      {topic.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm font-medium text-primary">{topic.titleRw}</p>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                    {topic.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {topic.glossary.length > 0 && (
                      <Badge variant="outline">
                        <Quote className="mr-1 h-3 w-3" aria-hidden />
                        {topic.glossary.length} definitions
                      </Badge>
                    )}
                    <Badge variant="outline">{topic.facts.length} facts</Badge>
                    <Badge variant="outline">{countFor(topic.slug)} questions</Badge>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <Card className="mt-8 border-dashed bg-surface">
          <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-muted-foreground">
              Read a topic, then test it. Practice mode gives instant feedback and keeps a record of
              anything you get wrong.
            </p>
            <Link
              href="/practice"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Go to practice
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
