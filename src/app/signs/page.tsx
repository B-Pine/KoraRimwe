import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/page-header';
import { SignsExplorer } from '@/components/signs/signs-explorer';
import { signs } from '@/data/signs';

export const metadata: Metadata = {
  title: 'Road Signs',
  description:
    'Searchable library of Rwandan road signs taken from the official Amategeko y’Umuhanda books, with the meaning the theory exam expects.',
};

export default function SignsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Road signs"
        title="Ibyapa byo mu muhanda"
        description="Every sign here was taken from the official books, and each meaning is the answer marked correct in the source. Filter by category or search in Kinyarwanda."
      />
      <SignsExplorer signs={signs} />
    </>
  );
}
