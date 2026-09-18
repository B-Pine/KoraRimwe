import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Home,
  ListChecks,
  MoreHorizontal,
  RefreshCw,
  Signpost,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  description?: string;
}

/** Desktop navigation — the full module list. */
export const primaryNav: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/study', label: 'Study', icon: BookOpen, description: 'Rules, definitions and verified facts' },
  { href: '/signs', label: 'Road Signs', icon: Signpost, description: 'Searchable sign library' },
  { href: '/practice', label: 'Practice', icon: ListChecks, description: 'Question bank with instant feedback' },
  { href: '/exams', label: 'Mock Exams', icon: ClipboardCheck, description: 'Timed exam simulation' },
  { href: '/revision', label: 'Revision', icon: RefreshCw, description: 'Retry what you got wrong' },
  { href: '/statistics', label: 'Statistics', icon: BarChart3, description: 'Progress and weak areas' },
];

/** Mobile bottom bar — five destinations, the rest behind "More". */
export const mobileNav: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/study', label: 'Study', icon: BookOpen },
  { href: '/practice', label: 'Practice', icon: ListChecks },
  { href: '/exams', label: 'Exams', icon: ClipboardCheck },
  { href: '/more', label: 'More', icon: MoreHorizontal },
];

/** Shown on the "More" screen on small devices. */
export const moreNav: NavItem[] = [
  { href: '/signs', label: 'Road Signs', icon: Signpost, description: 'Browse and search every sign' },
  { href: '/revision', label: 'Revision Centre', icon: RefreshCw, description: 'Work through your mistakes' },
  { href: '/statistics', label: 'Statistics', icon: BarChart3, description: 'Scores, accuracy and weak topics' },
];
