# KoraRimwe

**Prepare. Practice. Pass.** — a study and examination platform for the Rwandan driving theory
test (Amategeko y'Umuhanda).

No account, no server, no tracking. Everything a learner does is stored in their own browser.

---

## What's in it

| Module | What it does |
| --- | --- |
| **Study** | 11 topics combining statutory definitions and verified exam facts |
| **Road Signs** | 52 signs from the official books, searchable and filtered by Kinyarwanda category |
| **Practice** | 321 questions with instant feedback, filtered by topic, difficulty or past mistakes |
| **Mock Exams** | Timed papers with auto-scoring, pass/fail and a full review |
| **Revision Centre** | Retry every question you got wrong, plus topic recommendations |
| **Statistics** | Score history, accuracy by topic, study time and completion |

Global search (Ctrl/Cmd + K) covers topics, signs and questions.

---

## Content and language

The interface is English. **All learning content is Kinyarwanda, quoted from the source books** —
that is the language the theory examination is actually sat in, so the wording a learner sees here
is the wording they will meet in the exam room.

### Where the content came from

Content was extracted programmatically from three official Kinyarwanda books supplied with the
project (see `sources/`):

- `Amategeko yumuhanda.pdf` — the question bank, 149 pages
- `1037711814-Amategeko-Yumuhanda-Full-Edition-1.pdf` — glossary and rules, by Mutanyagwa Valentin
- `893312585-Tumenye-Amategeko-y-Umuhanda-1.pdf` — Campus Driving School study book

The source books cite **Presidential Order No 85/01 of 02/09/2002** on general traffic rules, and
Official Gazette No 1 of 1 January 2003.

### How answers were verified

In the source question bank the correct choice is marked by parenthesising its letter — `(c)` where
the other options read `a)`, `b)`, `d)`. The extraction pipeline uses that as the answer key:

- **321 questions kept** — exactly one marked answer, parsed cleanly
- **~60 questions dropped** — no answer marking in the source, more than one marking, or answer
  choices that were pictures which could not be reliably matched to their letter

Nothing was invented. If an answer could not be established from the book, the question was left
out rather than guessed. Every question carries a `sourceRef` (e.g. `Q229`) so any item can be
checked against the original.

Road signs were built the same way: 145 images were extracted from the PDFs, and each sign's
meaning is the answer marked correct for the question that shows it. Photographs, multi-sign
panels and road-marking diagrams were excluded from the sign library (they still appear in the
questions that use them).

> **Study aid only.** Always confirm current rules with the Rwanda National Police and the official
> Amategeko y'Umuhanda before sitting an examination.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run typecheck
npm run lint
```

Node 18.18+ is required (developed on Node 22).

### Deploying to Vercel

Push the repository and import it at [vercel.com/new](https://vercel.com/new). No environment
variables are needed. Everything is statically generated, so the free tier is enough.

---

## Tech

Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui-style components on Radix ·
Zustand (persisted to localStorage) · Recharts · Lucide.

All 81 routes are prerendered as static HTML at build time.

## Project layout

```
src/
  app/                 routes: study, signs, practice, exams, revision, statistics
  components/
    ui/                button, card, badge, progress, dialog, tabs, …
    layout/            header, mobile bottom nav, footer, logo
    exam/              exam runner, results, attempt history
    practice/          question card, practice client
    signs/  study/  stats/  revision/  search/
  data/                GENERATED — questions.ts, signs.ts, topics.ts, exams.ts
  lib/                 exam engine, progress store, search index, utils
  types/               domain types
public/signs/          114 sign images extracted from the books
sources/               the original PDFs (not deployed)
```

`src/data/questions.ts`, `signs.ts` and `topics.ts` are generated from the PDFs and marked as such
in a header comment — edit the extraction pipeline rather than the files, or your changes will be
overwritten if the content is ever rebuilt.

## Data model

Types in `src/types` mirror a relational schema (`topics`, `signs`, `questions`, exam blueprints)
so the static content can move to a database later without touching the UI. The persisted progress
store is versioned (`korarimwe-progress-v1`) so it can be migrated — or synced to an account —
without losing a learner's history.

Deliberately **not** built yet: accounts, driving-school dashboards, instructor management, paid
content, multi-language toggle. The structure leaves room for each.
