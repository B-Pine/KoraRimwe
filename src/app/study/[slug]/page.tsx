import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookMarked, CircleHelp, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StudyTracker } from '@/components/study/study-tracker';
import { topics } from '@/data/topics';
import { questions } from '@/data/questions';
import { signs } from '@/data/signs';

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) return { title: 'Topic not found' };
  return {
    title: topic.title,
    description: topic.summary,
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) notFound();

  const index = topics.findIndex((t) => t.slug === slug);
  const previous = topics[index - 1];
  const next = topics[index + 1];

  const topicQuestions = questions.filter((q) => q.topicSlug === topic.slug);
  const topicSigns =
    topic.slug === 'road-signs'
      ? signs.slice(0, 8)
      : signs.filter((s) =>
          s.relatedQuestionIds.some((id) => topicQuestions.some((q) => q.id === id))
        ).slice(0, 8);

  return (
    <>
      <StudyTracker slug={topic.slug} />

      <article className="container max-w-3xl py-8 sm:py-12">
        <Link
          href="/study"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All topics
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Topic {index + 1} of {topics.length}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{topic.title}</h1>
          <p className="mt-2 text-lg font-medium text-primary">{topic.titleRw}</p>
          <p className="prose-study mt-4">{topic.summary}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge variant="outline">{topic.glossary.length} definitions</Badge>
            <Badge variant="outline">{topic.facts.length} verified facts</Badge>
            <Badge variant="outline">{topicQuestions.length} practice questions</Badge>
          </div>
        </header>

        {topic.glossary.length > 0 && (
          <section className="mt-10" aria-labelledby="definitions-heading">
            <h2 id="definitions-heading" className="flex items-center gap-2 text-xl font-bold">
              <BookMarked className="h-5 w-5 text-primary" aria-hidden />
              Ibisobanuro — definitions
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Quoted from the glossary of the official book. The examination uses these exact terms.
            </p>

            <dl className="mt-5 grid gap-3">
              {topic.glossary.map((entry) => (
                <div
                  key={entry.article}
                  className="rounded-xl border border-border bg-card p-4 shadow-card"
                >
                  <dt className="flex items-baseline gap-2 font-semibold text-foreground">
                    {entry.term}
                    <span className="text-xs font-normal text-muted-foreground">
                      no. {entry.article}
                    </span>
                  </dt>
                  <dd className="prose-study mt-1.5">{entry.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {topic.facts.length > 0 && (
          <section className="mt-12" aria-labelledby="facts-heading">
            <h2 id="facts-heading" className="flex items-center gap-2 text-xl font-bold">
              <CircleHelp className="h-5 w-5 text-primary" aria-hidden />
              Ibibazo n’ibisubizo — verified facts
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Each answer below is the one marked correct in the source book, with its question
              number.
            </p>

            <ol className="mt-5 grid gap-4">
              {topic.facts.map((fact) => (
                <li key={fact.source} className="rounded-xl border border-border bg-card p-4 shadow-card">
                  <p className="text-sm font-semibold leading-6 text-foreground">{fact.question}</p>
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-secondary p-3">
                    <span className="mt-0.5 text-xs font-bold uppercase tracking-wide text-secondary-foreground">
                      Igisubizo
                    </span>
                    <p className="text-sm leading-6 text-secondary-foreground">{fact.answer}</p>
                  </div>
                  <p className="mt-2 text-right text-[11px] text-muted-foreground">{fact.source}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {topicSigns.length > 0 && (
          <section className="mt-12" aria-labelledby="signs-heading">
            <h2 id="signs-heading" className="text-xl font-bold">
              Related road signs
            </h2>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {topicSigns.map((sign) => (
                <li key={sign.id}>
                  <Link
                    href={`/signs/${sign.id}`}
                    className="flex h-full flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-shadow hover:shadow-lift"
                  >
                    <Image
                      src={sign.image}
                      alt=""
                      width={64}
                      height={64}
                      className="h-16 w-16 object-contain"
                    />
                    <span className="text-xs font-medium leading-snug text-foreground">
                      {sign.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Card className="mt-12 bg-surface">
          <CardContent className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">Ready to test this topic?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {topicQuestions.length} questions from the bank cover {topic.title.toLowerCase()}.
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link href={`/practice?topic=${topic.slug}`}>
                <ListChecks className="h-4 w-4" aria-hidden />
                Practise this topic
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Separator className="my-10" />

        <nav aria-label="Topic navigation" className="grid gap-3 sm:grid-cols-2">
          {previous ? (
            <Link
              href={`/study/${previous.slug}`}
              className="group rounded-xl border border-border p-4 transition-colors hover:border-primary"
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                Previous
              </span>
              <span className="mt-1 block font-medium text-foreground group-hover:text-primary">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {next && (
            <Link
              href={`/study/${next.slug}`}
              className="group rounded-xl border border-border p-4 text-right transition-colors hover:border-primary sm:col-start-2"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs font-medium text-muted-foreground">
                Next
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="mt-1 block font-medium text-foreground group-hover:text-primary">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      </article>
    </>
  );
}
