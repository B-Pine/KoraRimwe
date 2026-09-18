import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/page-header';
import { StatisticsClient } from '@/components/stats/statistics-client';

export const metadata: Metadata = {
  title: 'Statistics',
  description:
    'Track your exam scores, accuracy by topic, study time and overall progress towards the Rwandan driving theory exam.',
};

export default function StatisticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Statistics"
        title="Imibare y’iterambere ryawe"
        description="Everything on this page is calculated from your own attempts and stored only in this browser."
      />
      <StatisticsClient />
    </>
  );
}
