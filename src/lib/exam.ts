import { questions } from '@/data/questions';
import { topics } from '@/data/topics';
import type { AnsweredQuestion, ExamAttempt, ExamBlueprint, Question } from '@/types';
import { percentage, shuffle } from '@/lib/utils';

/**
 * Builds a paper for a blueprint. Questions are spread across topics in
 * proportion to the bank so a paper is never dominated by one subject, then
 * shuffled so the order differs every sitting.
 */
export function generateExam(blueprint: ExamBlueprint): Question[] {
  const pool = blueprint.focusTopics?.length
    ? questions.filter((q) => blueprint.focusTopics!.includes(q.topicSlug))
    : questions;

  if (pool.length <= blueprint.questionCount) return shuffle(pool);

  const byTopic = new Map<string, Question[]>();
  for (const q of pool) {
    if (!byTopic.has(q.topicSlug)) byTopic.set(q.topicSlug, []);
    byTopic.get(q.topicSlug)!.push(q);
  }

  const picked: Question[] = [];
  const entries = [...byTopic.entries()];

  // Proportional allocation, at least one question from each topic present.
  for (const [, list] of entries) {
    const share = Math.max(1, Math.round((list.length / pool.length) * blueprint.questionCount));
    picked.push(...shuffle(list).slice(0, share));
  }

  // Trim or top up to the exact count.
  let result = shuffle(picked).slice(0, blueprint.questionCount);
  if (result.length < blueprint.questionCount) {
    const chosen = new Set(result.map((q) => q.id));
    const filler = shuffle(pool.filter((q) => !chosen.has(q.id)));
    result = [...result, ...filler.slice(0, blueprint.questionCount - result.length)];
  }
  return result;
}

export function scoreExam(
  blueprint: ExamBlueprint,
  paper: Question[],
  selections: Record<string, number | null>,
  startedAt: number,
  finishedAt: number
): ExamAttempt {
  const answers: AnsweredQuestion[] = paper.map((q) => {
    const selected = selections[q.id] ?? null;
    return { questionId: q.id, selected, correct: selected === q.answer };
  });

  const topicBreakdown: Record<string, { correct: number; total: number }> = {};
  paper.forEach((q, i) => {
    const bucket = (topicBreakdown[q.topicSlug] ??= { correct: 0, total: 0 });
    bucket.total += 1;
    if (answers[i].correct) bucket.correct += 1;
  });

  const score = answers.filter((a) => a.correct).length;

  return {
    id: `attempt-${finishedAt}-${Math.random().toString(36).slice(2, 8)}`,
    blueprintId: blueprint.id,
    blueprintName: blueprint.name,
    startedAt,
    finishedAt,
    durationSeconds: Math.round((finishedAt - startedAt) / 1000),
    answers,
    score,
    total: paper.length,
    percentage: percentage(score, paper.length),
    passed: score >= blueprint.passMark,
    topicBreakdown,
  };
}

export const topicTitle = (slug: string) =>
  topics.find((t) => t.slug === slug)?.title ?? slug.replace(/-/g, ' ');

/** Topics ranked weakest first, used by the Revision Centre and Statistics. */
export function rankTopics(stats: Record<string, { correct: number; attempted: number }>) {
  return Object.entries(stats)
    .filter(([, s]) => s.attempted >= 3)
    .map(([slug, s]) => ({
      slug,
      title: topicTitle(slug),
      accuracy: percentage(s.correct, s.attempted),
      attempted: s.attempted,
      correct: s.correct,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}
