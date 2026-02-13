-- CreateTable
CREATE TABLE "DailyActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "problemsSolved" INTEGER NOT NULL DEFAULT 0,
    "problemsAttempted" INTEGER NOT NULL DEFAULT 0,
    "quizzesTaken" INTEGER NOT NULL DEFAULT 0,
    "minutesStudied" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dailyGoal" INTEGER NOT NULL DEFAULT 3,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "StudyEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "entityName" TEXT NOT NULL,
    "metadata" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "problemId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bookmark_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "problemId" INTEGER,
    "conceptId" INTEGER,
    "content" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Note_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Note_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "percentage" REAL NOT NULL,
    "patternPerformance" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Concept" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topicId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timeComplexity" TEXT NOT NULL DEFAULT '',
    "spaceComplexity" TEXT NOT NULL DEFAULT '',
    "whenToUse" TEXT NOT NULL DEFAULT '',
    "codeExample" TEXT NOT NULL DEFAULT '',
    "flashcardFront" TEXT NOT NULL DEFAULT '',
    "flashcardBack" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Concept_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Concept" ("codeExample", "content", "id", "order", "spaceComplexity", "timeComplexity", "title", "topicId", "whenToUse") SELECT "codeExample", "content", "id", "order", "spaceComplexity", "timeComplexity", "title", "topicId", "whenToUse" FROM "Concept";
DROP TABLE "Concept";
ALTER TABLE "new_Concept" RENAME TO "Concept";
CREATE TABLE "new_ProblemAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "problemId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'attempted',
    "attemptCount" INTEGER NOT NULL DEFAULT 1,
    "nextReviewDate" DATETIME,
    "interval" REAL NOT NULL DEFAULT 0,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "timeSpentSecs" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProblemAttempt_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProblemAttempt" ("createdAt", "id", "problemId", "status") SELECT "createdAt", "id", "problemId", "status" FROM "ProblemAttempt";
DROP TABLE "ProblemAttempt";
ALTER TABLE "new_ProblemAttempt" RENAME TO "ProblemAttempt";
CREATE UNIQUE INDEX "ProblemAttempt_problemId_key" ON "ProblemAttempt"("problemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "DailyActivity_date_key" ON "DailyActivity"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_problemId_key" ON "Bookmark"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "Note_problemId_key" ON "Note"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "Note_conceptId_key" ON "Note"("conceptId");
