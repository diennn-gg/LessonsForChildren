import type { LessonItem, QuizQuestion } from '../types';

const shuffle = <T>(arr: T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5);

export const generateQuizQuestions = (
  items: LessonItem[],
  count: number
): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  const pool = shuffle(items);

  for (let i = 0; i < count; i++) {
    const correctItem = pool[i % pool.length];
    const wrongCandidates = items.filter((item) => item.id !== correctItem.id);
    const wrongItem = shuffle(wrongCandidates)[0];

    const options = shuffle([correctItem, wrongItem]);

    questions.push({
      id: `q-${i}`,
      type: 'identify',
      question: `Đâu là ${correctItem.name.toLowerCase()}?`,
      correctItem,
      options,
    });
  }

  return questions;
};
