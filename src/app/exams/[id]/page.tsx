import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ExamRunner } from '@/components/exam/exam-runner';
import { examBlueprints } from '@/data/exams';

export function generateStaticParams() {
  return examBlueprints.map((blueprint) => ({ id: blueprint.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const blueprint = examBlueprints.find((b) => b.id === id);
  if (!blueprint) return { title: 'Exam not found' };
  return { title: blueprint.name, description: blueprint.description };
}

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blueprint = examBlueprints.find((b) => b.id === id);
  if (!blueprint) notFound();

  return <ExamRunner blueprint={blueprint} />;
}
