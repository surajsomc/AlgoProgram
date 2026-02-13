# AlgoPrep

A comprehensive DSA (Data Structures & Algorithms) interview preparation platform built with Next.js, featuring spaced repetition, flashcards, timed practice, and analytics.

## Features

- **191 Problems** across 20 topics covering all major DSA patterns
- **Spaced Repetition (SM-2)** — automatically schedules problem reviews based on your performance
- **Flashcards** — flip-card study mode for every concept, with shuffle and progress tracking
- **Timed Practice** — countdown timer with auto-reveal, color-coded urgency indicators
- **Streaks & Daily Goals** — track your consistency with configurable daily targets
- **Bookmarks & Notes** — save problems for later and attach personal notes
- **Weakness Map** — identifies your weakest patterns based on quiz and attempt data
- **Activity Heatmap** — GitHub-style calendar showing your study activity over the past year
- **Quiz Mode** — pattern-based quizzes with per-pattern performance breakdown
- **Cheat Sheets** — auto-generated reference sheets for each topic, print-friendly
- **Mastery Levels** — 4-tier progression: New → Attempted → Solved → Mastered
- **Difficulty Filtering** — filter problems by Easy / Medium / Hard on any topic page

## Topics

Arrays & Hashing, Two Pointers, Sliding Window, Binary Search, Linked Lists, Stacks & Queues, Trees, Tries, Heap / Priority Queue, Graphs, Backtracking, Dynamic Programming, Greedy, Intervals, Bit Manipulation, Math & Geometry, Union Find, Sorting & Searching, Prefix Sum, Recursion

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** SQLite via Prisma ORM
- **Styling:** Tailwind CSS
- **Algorithm:** SM-2 Spaced Repetition

## Getting Started

```bash
# Install dependencies
npm install

# Set up the database
npx prisma migrate dev

# Seed with 191 problems
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start studying.

## Project Structure

```
src/
├── app/
│   ├── api/          # 12 API routes (progress, review, bookmarks, notes, etc.)
│   ├── bookmarks/    # Saved problems page
│   ├── flashcards/   # Topic flashcard selector
│   ├── practice/     # Problem solving with timer, notes, bookmarks
│   ├── quiz/         # Pattern-based quiz mode
│   ├── review/       # Spaced repetition review queue
│   └── topics/       # Topic pages with flashcards & cheat sheets
├── components/       # 20+ reusable components
├── lib/
│   ├── db.ts         # Prisma client
│   └── sm2.ts        # SM-2 spaced repetition algorithm
prisma/
├── schema.prisma     # Database schema (12 models)
├── seed.ts           # Seed orchestrator
└── seed-data/        # 20 topic data files
```
