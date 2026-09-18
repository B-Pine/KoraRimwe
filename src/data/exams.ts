import type { ExamBlueprint } from '@/types';

/**
 * Exam papers are generated from these blueprints at runtime — the question set
 * is drawn fresh each attempt, so no two sittings are identical.
 *
 * The police theory examination is a set of 20 questions, so every paper marked
 * "official format" below uses 20 questions in 20 minutes with a 16-correct
 * pass mark. The shorter and longer papers are training aids, and say so.
 */
export const examBlueprints: ExamBlueprint[] = [
  {
    id: 'police-exam',
    name: 'Police Theory Exam',
    description:
      'Official format: a set of 20 questions in 20 minutes, 16 correct to pass. This is the paper to rehearse.',
    questionCount: 20,
    durationMinutes: 20,
    passMark: 16,
  },
  {
    id: 'signs-paper',
    name: 'Road Signs Paper',
    description:
      'Official format, signs only: 20 picture questions drawn from the books. Strong preparation for ibyapa questions.',
    questionCount: 20,
    durationMinutes: 20,
    passMark: 16,
    focusTopics: ['road-signs'],
  },
  {
    id: 'quick-test',
    name: 'Quick Test',
    description:
      'Training paper, not the official format: 10 questions in 10 minutes for a daily check-up.',
    questionCount: 10,
    durationMinutes: 10,
    passMark: 8,
  },
  {
    id: 'endurance',
    name: 'Endurance Paper',
    description:
      'Training paper, not the official format: 40 questions in 40 minutes across the whole syllabus to expose weak areas.',
    questionCount: 40,
    durationMinutes: 40,
    passMark: 32,
  },
];

/** Papers that match the real examination shape. */
export const OFFICIAL_QUESTION_COUNT = 20;

export const isOfficialFormat = (blueprint: ExamBlueprint) =>
  blueprint.questionCount === OFFICIAL_QUESTION_COUNT;

export const blueprintById = new Map(examBlueprints.map((b) => [b.id, b]));
