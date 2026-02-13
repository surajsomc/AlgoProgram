export interface SM2Input {
  quality: number; // 0-5
  repetitions: number;
  easeFactor: number;
  interval: number; // days
}

export interface SM2Output {
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextReviewDate: Date;
}

export function sm2(input: SM2Input): SM2Output {
  const { quality, repetitions: reps, easeFactor: ef, interval: prev } = input;

  let newReps: number;
  let newInterval: number;
  let newEF: number;

  if (quality < 3) {
    // Failed review — reset
    newReps = 0;
    newInterval = 1;
    newEF = Math.max(1.3, ef - 0.2);
  } else {
    // Successful review
    if (reps === 0) {
      newInterval = 1;
    } else if (reps === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(prev * ef);
    }
    newReps = reps + 1;
    newEF = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    repetitions: newReps,
    easeFactor: Math.round(newEF * 100) / 100,
    interval: newInterval,
    nextReviewDate,
  };
}

export function actionToQuality(
  action: string,
  usedHints: boolean = false,
  timeSpentSecs: number = 0
): number {
  if (action === "mastered") {
    return timeSpentSecs > 0 && timeSpentSecs < 300 ? 5 : 5;
  }
  if (action === "solve") {
    if (usedHints) return 3;
    if (timeSpentSecs > 0 && timeSpentSecs < 300) return 5;
    return 4;
  }
  if (action === "attempt") return 1;
  return 0;
}

export function todayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function yesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
