import { PrismaClient } from "@prisma/client";
import { getArraysAndHashingData } from "./seed-data/topic-01-arrays";
import { getTwoPointersData } from "./seed-data/topic-02-two-pointers";
import { getSlidingWindowData } from "./seed-data/topic-03-sliding-window";
import { getBinarySearchData } from "./seed-data/topic-04-binary-search";
import { getLinkedListsData } from "./seed-data/topic-05-linked-lists";
import { getStacksData } from "./seed-data/topic-06-stacks";
import { getTreesData } from "./seed-data/topic-07-trees";
import { getTriesData } from "./seed-data/topic-08-tries";
import { getHeapData } from "./seed-data/topic-09-heap";
import { getGraphsData } from "./seed-data/topic-10-graphs";
import { getBacktrackingData } from "./seed-data/topic-11-backtracking";
import { getDynamicProgrammingData } from "./seed-data/topic-12-dp";
import { getGreedyData } from "./seed-data/topic-13-greedy";
import { getIntervalsData } from "./seed-data/topic-14-intervals";
import { getBitManipulationData } from "./seed-data/topic-15-bits";
import { getMathData } from "./seed-data/topic-16-math";
import { getUnionFindData } from "./seed-data/topic-17-union-find";
import { getSortingData } from "./seed-data/topic-18-sorting";
import { getPrefixSumData } from "./seed-data/topic-19-prefix-sum";
import { getRecursionData } from "./seed-data/topic-20-recursion";

const prisma = new PrismaClient();

const topicDataFns = [
  getArraysAndHashingData,
  getTwoPointersData,
  getSlidingWindowData,
  getBinarySearchData,
  getLinkedListsData,
  getStacksData,
  getTreesData,
  getTriesData,
  getHeapData,
  getGraphsData,
  getBacktrackingData,
  getDynamicProgrammingData,
  getGreedyData,
  getIntervalsData,
  getBitManipulationData,
  getMathData,
  getUnionFindData,
  getSortingData,
  getPrefixSumData,
  getRecursionData,
];

async function main() {
  console.log("Clearing existing data...");
  await prisma.quizAttempt.deleteMany();
  await prisma.studyEvent.deleteMany();
  await prisma.dailyActivity.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.note.deleteMany();
  await prisma.problemAttempt.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.concept.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.userSettings.deleteMany();

  let totalProblems = 0;

  for (const fn of topicDataFns) {
    const data = fn();
    console.log(`Seeding: ${data.name}`);
    const topic = await prisma.topic.create({ data });
    const problemCount = await prisma.problem.count({ where: { topicId: topic.id } });
    totalProblems += problemCount;
    console.log(`  → ${problemCount} problems`);
  }

  // Seed UserSettings
  await prisma.userSettings.create({
    data: { id: 1, dailyGoal: 3, currentStreak: 0, longestStreak: 0, lastActiveDate: "" },
  });

  console.log(`\nSeeding complete! 20 topics with ${totalProblems} problems.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
