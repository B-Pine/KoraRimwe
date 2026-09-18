'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { ExamAttempt, TopicStat } from '@/types';

/**
 * All progress lives in the browser — no account, no server. The persisted
 * shape is versioned so a future release can migrate it (or sync it to an
 * account) without losing a learner's history.
 */
interface ProgressState {
  attempts: ExamAttempt[];
  /** Questions answered wrongly and not yet cleared, newest first. */
  incorrectQuestionIds: string[];
  /** Questions the learner has since answered correctly in revision. */
  masteredQuestionIds: string[];
  bookmarkedQuestionIds: string[];
  topicStats: Record<string, TopicStat>;
  /** Slugs of study topics opened at least once. */
  studiedTopics: string[];
  /** Total seconds spent on study pages. */
  studySeconds: number;
  practiceAnswered: number;
  practiceCorrect: number;

  recordAnswer: (input: {
    questionId: string;
    topicSlug: string;
    correct: boolean;
    source: 'practice' | 'exam' | 'revision';
  }) => void;
  recordAttempt: (attempt: ExamAttempt) => void;
  toggleBookmark: (questionId: string) => void;
  markTopicStudied: (slug: string) => void;
  addStudyTime: (seconds: number) => void;
  clearIncorrect: (questionId: string) => void;
  resetProgress: () => void;
}

/** Inert storage used during server rendering, where there is no browser. */
const serverStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const initial = {
  attempts: [] as ExamAttempt[],
  incorrectQuestionIds: [] as string[],
  masteredQuestionIds: [] as string[],
  bookmarkedQuestionIds: [] as string[],
  topicStats: {} as Record<string, TopicStat>,
  studiedTopics: [] as string[],
  studySeconds: 0,
  practiceAnswered: 0,
  practiceCorrect: 0,
};

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial,

      recordAnswer: ({ questionId, topicSlug, correct, source }) =>
        set((state) => {
          const stat = state.topicStats[topicSlug] ?? { correct: 0, attempted: 0 };
          const topicStats = {
            ...state.topicStats,
            [topicSlug]: {
              correct: stat.correct + (correct ? 1 : 0),
              attempted: stat.attempted + 1,
            },
          };

          const incorrect = new Set(state.incorrectQuestionIds);
          const mastered = new Set(state.masteredQuestionIds);
          if (correct) {
            incorrect.delete(questionId);
            mastered.add(questionId);
          } else {
            incorrect.add(questionId);
            mastered.delete(questionId);
          }

          return {
            topicStats,
            incorrectQuestionIds: [...incorrect],
            masteredQuestionIds: [...mastered],
            practiceAnswered: state.practiceAnswered + (source === 'exam' ? 0 : 1),
            practiceCorrect: state.practiceCorrect + (source !== 'exam' && correct ? 1 : 0),
          };
        }),

      recordAttempt: (attempt) =>
        set((state) => ({ attempts: [attempt, ...state.attempts].slice(0, 50) })),

      toggleBookmark: (questionId) =>
        set((state) => ({
          bookmarkedQuestionIds: state.bookmarkedQuestionIds.includes(questionId)
            ? state.bookmarkedQuestionIds.filter((id) => id !== questionId)
            : [...state.bookmarkedQuestionIds, questionId],
        })),

      markTopicStudied: (slug) =>
        set((state) =>
          state.studiedTopics.includes(slug)
            ? state
            : { studiedTopics: [...state.studiedTopics, slug] }
        ),

      addStudyTime: (seconds) =>
        set((state) => ({ studySeconds: state.studySeconds + Math.max(0, seconds) })),

      clearIncorrect: (questionId) =>
        set((state) => ({
          incorrectQuestionIds: state.incorrectQuestionIds.filter((id) => id !== questionId),
        })),

      resetProgress: () => set({ ...initial }),
    }),
    {
      name: 'korarimwe-progress-v1',
      // localStorage does not exist while prerendering on the server.
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? serverStorage : window.localStorage
      ),
      version: 1,
    }
  )
);

/**
 * Guards against hydration mismatches: persisted state only exists in the
 * browser, so components render neutral values until rehydration finishes.
 */
export function useHydrated() {
  // Always false on the first render so the server and client markup agree.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const api = useProgress.persist;
    if (!api) {
      setHydrated(true);
      return;
    }
    if (api.hasHydrated()) setHydrated(true);
    return api.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
