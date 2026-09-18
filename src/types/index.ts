/**
 * Core domain types for KoraRimwe.
 *
 * Shapes mirror a relational schema so the generated JSON content can later be
 * served from a database without touching the UI:
 *   topics(id, slug, ...) · signs(id, category, ...) · questions(id, topic_slug, sign_id, ...)
 * Exams are generated from blueprints at runtime and never stored as content.
 *
 * Interface copy is English; all learning content is quoted in Kinyarwanda from
 * the official books, which is the language the theory exam is sat in.
 */

/** A statutory definition quoted from the book's glossary. */
export interface GlossaryEntry {
  term: string;
  definition: string;
  /** Numbered entry in the source glossary. */
  article: number;
}

/** A question and its verified answer, used as revision material. */
export interface TopicFact {
  question: string;
  answer: string;
  /** Question number in the source book. */
  source: string;
}

export interface Topic {
  id: string;
  slug: string;
  /** English title used in the interface. */
  title: string;
  /** Kinyarwanda title as the books name the subject. */
  titleRw: string;
  summary: string;
  glossary: GlossaryEntry[];
  facts: TopicFact[];
}

export type SignCategory =
  | 'warning'
  | 'regulatory'
  | 'mandatory'
  | 'prohibition'
  | 'information'
  | 'temporary';

export interface RoadSign {
  id: string;
  /** Path under /public, extracted from the source book. */
  image: string;
  name: string;
  category: SignCategory;
  meaning: string;
  relatedQuestionIds: string[];
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionKind = 'multiple-choice' | 'true-false' | 'image';

export interface Question {
  id: string;
  kind: QuestionKind;
  topicSlug: string;
  difficulty: Difficulty;
  prompt: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  /** Present on image questions: the sign shown above the prompt. */
  image?: string;
  /** Set when the image is a catalogued sign. */
  signId?: string;
  /** Question number in the source book, for traceability. */
  sourceRef: string;
}

export interface ExamBlueprint {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  durationMinutes: number;
  /** Number of correct answers required to pass. */
  passMark: number;
  /** Restricts generation to these topics when present. */
  focusTopics?: string[];
}

export interface AnsweredQuestion {
  questionId: string;
  /** null when skipped or timed out. */
  selected: number | null;
  correct: boolean;
}

export interface ExamAttempt {
  id: string;
  blueprintId: string;
  blueprintName: string;
  startedAt: number;
  finishedAt: number;
  durationSeconds: number;
  answers: AnsweredQuestion[];
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  /** Correct / total per topic slug, driving the weak-area engine. */
  topicBreakdown: Record<string, { correct: number; total: number }>;
}

export interface TopicStat {
  correct: number;
  attempted: number;
}

export interface PracticeRecord {
  questionId: string;
  correct: boolean;
  answeredAt: number;
}
