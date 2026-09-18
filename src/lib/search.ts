import { questions } from '@/data/questions';
import { signs } from '@/data/signs';
import { topics } from '@/data/topics';

export type SearchKind = 'topic' | 'sign' | 'question';

export interface SearchResult {
  kind: SearchKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image?: string;
}

interface IndexEntry extends SearchResult {
  haystack: string;
}

/** Built once at module load — the content is static, so the index is too. */
const index: IndexEntry[] = [
  ...topics.map((t) => ({
    kind: 'topic' as const,
    id: t.slug,
    title: t.title,
    subtitle: t.titleRw,
    href: `/study/${t.slug}`,
    haystack: [
      t.title,
      t.titleRw,
      t.summary,
      ...t.glossary.map((g) => `${g.term} ${g.definition}`),
      ...t.facts.map((f) => `${f.question} ${f.answer}`),
    ]
      .join(' ')
      .toLowerCase(),
  })),
  ...signs.map((s) => ({
    kind: 'sign' as const,
    id: s.id,
    title: s.name,
    subtitle: s.meaning,
    href: `/signs/${s.id}`,
    image: s.image,
    haystack: `${s.name} ${s.meaning} ${s.category}`.toLowerCase(),
  })),
  ...questions.map((q) => ({
    kind: 'question' as const,
    id: q.id,
    title: q.prompt,
    subtitle: q.options[q.answer],
    href: `/practice?question=${q.id}`,
    image: q.image,
    haystack: `${q.prompt} ${q.options.join(' ')}`.toLowerCase(),
  })),
];

const KIND_WEIGHT: Record<SearchKind, number> = { topic: 3, sign: 2, question: 1 };

export function search(query: string, limit = 24): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const scored: { entry: IndexEntry; score: number }[] = [];
  for (const entry of index) {
    let score = 0;
    for (const term of terms) {
      const at = entry.haystack.indexOf(term);
      if (at === -1) {
        score = -1;
        break;
      }
      // earlier matches and title matches count for more
      score += at < 60 ? 3 : 1;
      if (entry.title.toLowerCase().includes(term)) score += 4;
    }
    if (score > 0) scored.push({ entry, score: score + KIND_WEIGHT[entry.kind] });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => {
      const { haystack: _haystack, ...result } = entry;
      return result;
    });
}

export const searchCorpusSize = index.length;
