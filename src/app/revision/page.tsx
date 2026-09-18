import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/page-header';
import { RevisionClient } from '@/components/revision/revision-client';

export const metadata: Metadata = {
  title: 'Revision Centre',
  description:
    'Retry the questions you got wrong, review saved questions and get topic recommendations based on your own results.',
};

export default function RevisionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Revision centre"
        title="Isubiramo — fix your weak areas"
        description="Everything you answered incorrectly is collected here until you get it right. Your results also point you to the topics worth re-reading."
      />
      <RevisionClient />
    </>
  );
}
