import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  ListChecks,
  ShieldCheck,
  Signpost,
  Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ContinueCard } from '@/components/home/continue-card';
import { questions } from '@/data/questions';
import { signs } from '@/data/signs';
import { topics } from '@/data/topics';
import { examBlueprints } from '@/data/exams';

const stats = [
  { label: 'Exam questions', value: questions.length, hint: 'verified against the answer key' },
  { label: 'Road signs', value: signs.length, hint: 'from the official books' },
  { label: 'Mock exam papers', value: examBlueprints.length, hint: 'generated fresh each sitting' },
  { label: 'Study topics', value: topics.length, hint: 'rules, definitions and facts' },
];

const features = [
  {
    href: '/study',
    icon: BookOpen,
    title: 'Learn the road rules',
    description:
      'Statutory definitions and verified facts, grouped into eleven topics you can read in a sitting.',
  },
  {
    href: '/signs',
    icon: Signpost,
    title: 'Explore road signs',
    description:
      'Every sign from the books, searchable and filtered by category, with the meaning the exam expects.',
  },
  {
    href: '/practice',
    icon: ListChecks,
    title: 'Practise questions',
    description:
      'Filter by topic or difficulty, answer at your own pace and see the correct answer immediately.',
  },
  {
    href: '/exams',
    icon: ClipboardCheck,
    title: 'Simulate the real exam',
    description:
      'Timed papers, automatic scoring, a pass mark and a full review of every question you missed.',
  },
];

export default function HomePage() {
  const imageQuestions = questions.filter((q) => q.image).length;

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-secondary/60 to-background">
        <div className="container py-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
                Amategeko y’Umuhanda · Rwanda
              </p>

              <h1 className="mt-5 text-balance text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                KoraRimwe
              </h1>
              <p className="mt-4 max-w-xl text-balance text-base leading-7 text-muted-foreground sm:text-lg">
                Master Rwanda road rules and prepare confidently for your driving theory exam.
                Questions are quoted in Kinyarwanda, exactly as you will meet them in the
                examination room.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/study">
                    Start learning
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/exams">
                    <Timer className="h-4 w-4" aria-hidden />
                    Take mock exam
                  </Link>
                </Button>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                No account needed. Your progress stays on this device.
              </p>
            </div>

            <ContinueCard totalQuestions={questions.length} />
          </div>
        </div>
      </section>

      <section aria-labelledby="stats-heading" className="border-b border-border bg-background">
        <h2 id="stats-heading" className="sr-only">
          What the platform contains
        </h2>
        <div className="container grid grid-cols-2 gap-px overflow-hidden bg-border py-0 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background px-4 py-6 text-center sm:py-8">
              <p className="font-display text-3xl font-bold text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">{stat.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{stat.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="features-heading" className="container py-12 sm:py-16">
        <div className="max-w-2xl">
          <h2 id="features-heading" className="text-2xl font-bold sm:text-3xl">
            Everything you need to pass
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Four modules that take you from reading the rules to sitting a full timed paper, with
            a revision centre that keeps track of what you keep getting wrong.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.href} className="transition-shadow hover:shadow-lift">
                <CardContent className="flex h-full flex-col p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                  <Link
                    href={feature.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    Open
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    <span className="sr-only">{feature.title}</span>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="container py-12 sm:py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h2 className="text-lg font-semibold">Taken from the official books</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Every question in the bank carries the answer printed in the source material, and
                questions whose answer could not be verified were left out.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{imageQuestions} picture questions</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Road signs are shown exactly as the examination presents them, so you recognise the
                shape and colour before you read a word.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Built for the exam room</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Mock papers follow the 20-question, 20-minute shape with a 16-correct pass mark, so
                the timing feels familiar on the day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
