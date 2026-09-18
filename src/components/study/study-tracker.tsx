'use client';

import { useEffect, useRef } from 'react';
import { useProgress } from '@/lib/store';

/**
 * Marks a topic as read and banks the time spent on the page, so the
 * Statistics dashboard can report study time without any server.
 */
export function StudyTracker({ slug }: { slug: string }) {
  const markTopicStudied = useProgress((s) => s.markTopicStudied);
  const addStudyTime = useProgress((s) => s.addStudyTime);
  const openedAt = useRef(Date.now());

  useEffect(() => {
    markTopicStudied(slug);
    const started = Date.now();
    openedAt.current = started;

    return () => {
      // Cap a single session at 30 minutes: a tab left open all night is not study.
      const seconds = Math.min(1800, Math.round((Date.now() - started) / 1000));
      if (seconds > 5) addStudyTime(seconds);
    };
  }, [slug, markTopicStudied, addStudyTime]);

  return null;
}
