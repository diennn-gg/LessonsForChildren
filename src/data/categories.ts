import type { Category } from '../types';
import { animals } from './animals';
import { colors } from './colors';
import { fruits } from './fruits';
import { numbers } from './numbers';

const chunk = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export const categories: Category[] = [
  {
    id: 'animals',
    title: 'Động vật',
    icon: '🐾',
    color: 'bg-orange-100',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-300',
    lessons: chunk(animals, 10).map((items, i) => ({
      id: `animals-${i + 1}`,
      title: `Động vật - Bài ${i + 1}`,
      categoryId: 'animals',
      items,
      quizCount: 10,
    })),
  },
  {
    id: 'colors',
    title: 'Màu sắc',
    icon: '🎨',
    color: 'bg-pink-100',
    textColor: 'text-pink-600',
    borderColor: 'border-pink-300',
    lessons: chunk(colors, 10).map((items, i) => ({
      id: `colors-${i + 1}`,
      title: `Màu sắc - Bài ${i + 1}`,
      categoryId: 'colors',
      items,
      quizCount: 10,
    })),
  },
  {
    id: 'fruits',
    title: 'Trái cây',
    icon: '🍎',
    color: 'bg-red-100',
    textColor: 'text-red-600',
    borderColor: 'border-red-300',
    lessons: chunk(fruits, 10).map((items, i) => ({
      id: `fruits-${i + 1}`,
      title: `Trái cây - Bài ${i + 1}`,
      categoryId: 'fruits',
      items,
      quizCount: 10,
    })),
  },
  {
    id: 'numbers',
    title: 'Số đếm',
    icon: '🔢',
    color: 'bg-blue-100',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-300',
    lessons: chunk(numbers, 10).map((items, i) => ({
      id: `numbers-${i + 1}`,
      title: `Số đếm - Bài ${i + 1}`,
      categoryId: 'numbers',
      items,
      quizCount: 10,
    })),
  },
];

export const findLesson = (lessonId: string) => {
  for (const cat of categories) {
    const lesson = cat.lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, category: cat };
  }
  return null;
};
