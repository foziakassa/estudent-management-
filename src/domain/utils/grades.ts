export function clampScore(value: string): number {
  return Math.min(100, Math.max(0, parseInt(value) || 0));
}

export function calcAverage(
  quiz: number,
  assignment: number,
  test: number,
  final: number
): number {
  return Math.round((quiz + assignment + test + final) / 4);
}

export function calcLetterGrade(total: number): string {
  if (total >= 90) return "A";
  if (total >= 80) return "B";
  if (total >= 70) return "C";
  if (total >= 60) return "D";
  return "F";
}

export function deriveSubjectScores(score: number) {
  const quiz = Math.round(score * 0.95);
  const test = Math.round(score * 0.97);
  const final = score;
  const avg = Math.round((quiz + test + final) / 3);
  const letter = calcLetterGrade(avg);
  return { quiz, test, final, avg, letter };
}
