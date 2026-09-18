import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { PracticeClient } from '@/components/practice/practice-client';
import { questions } from '@/data/questions';

export const metadata: Metadata = {
  title: 'Practice Questions',
  description:
    'Practise verified Rwandan driving theory questions with instant feedback. Filter by topic and difficulty, or work only through the questions you got wrong.',
};

export default function PracticePage() {
  return (
    <>
      <PageHeader
        eyebrow="Practice"
        title="Imyitozo — practice questions"
        description={`${questions.length} questions taken from the official books, each with the answer printed in the source. Answer at your own pace; there is no timer here.`}
      />
      <Suspense fallback={<div className="container py-10 text-sm text-muted-foreground">Loading questions…</div>}>
        <PracticeClient />
      </Suspense>
    </>
  );
}
