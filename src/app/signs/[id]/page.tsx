import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  categoryDescription,
  categoryLabel,
  categoryLabelEn,
} from '@/components/signs/sign-categories';
import { signs } from '@/data/signs';
import { questions } from '@/data/questions';

export function generateStaticParams() {
  return signs.map((sign) => ({ id: sign.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const sign = signs.find((s) => s.id === id);
  if (!sign) return { title: 'Sign not found' };
  return {
    title: sign.name,
    description: `${sign.name} — ${sign.meaning}. ${categoryLabelEn(sign.category)} sign (${categoryLabel(sign.category)}) from the Rwandan road code.`,
  };
}

export default async function SignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sign = signs.find((s) => s.id === id);
  if (!sign) notFound();

  const related = questions.filter((q) => sign.relatedQuestionIds.includes(q.id));
  const sameCategory = signs.filter((s) => s.category === sign.category && s.id !== sign.id).slice(0, 6);

  return (
    <div className="container max-w-3xl py-8 sm:py-12">
      <Link
        href="/signs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All road signs
      </Link>

      <div className="mt-6 flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-6 text-center shadow-card sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-xl bg-surface p-4">
          <Image
            src={sign.image}
            alt={sign.name}
            width={128}
            height={128}
            priority
            className="h-full w-full object-contain"
          />
        </div>

        <div>
          <Badge variant="default">
            {categoryLabel(sign.category)} · {categoryLabelEn(sign.category)}
          </Badge>
          <h1 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">{sign.name}</h1>
          <p className="prose-study mt-3">{sign.meaning}</p>
        </div>
      </div>

      <section className="mt-8" aria-labelledby="category-heading">
        <h2 id="category-heading" className="text-lg font-bold">
          What this category means
        </h2>
        <p className="prose-study mt-2">{categoryDescription(sign.category)}</p>
      </section>

      {related.length > 0 && (
        <section className="mt-10" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-lg font-bold">
            Exam questions on this sign
          </h2>
          <ul className="mt-4 grid gap-3">
            {related.map((question) => (
              <li key={question.id}>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-semibold leading-6">{question.prompt}</p>
                    <div className="mt-3 rounded-lg bg-secondary p-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-secondary-foreground">
                        Igisubizo
                      </p>
                      <p className="mt-1 text-sm leading-6 text-secondary-foreground">
                        {question.options[question.answer]}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

          <Button asChild variant="outline" className="mt-4">
            <Link href="/practice?topic=road-signs">Practise sign questions</Link>
          </Button>
        </section>
      )}

      {sameCategory.length > 0 && (
        <section className="mt-10" aria-labelledby="similar-heading">
          <h2 id="similar-heading" className="text-lg font-bold">
            Ibindi byapa: {categoryLabel(sign.category)}
          </h2>
          <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {sameCategory.map((other) => (
              <li key={other.id}>
                <Link
                  href={`/signs/${other.id}`}
                  className="flex flex-col items-center gap-2 rounded-lg border border-border p-2 transition-shadow hover:shadow-card"
                  title={other.name}
                >
                  <Image
                    src={other.image}
                    alt={other.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
