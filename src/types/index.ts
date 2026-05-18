export interface LessonItem {
  id: string;
  name: string;         // Tên tiếng Việt
  emoji: string;        // Emoji đại diện (dễ dàng thay bằng image URL sau)
  imageUrl?: string;    // Optional: ảnh thật
  pronunciation?: string; // Phiên âm hỗ trợ TTS
}

export type QuizType = 'identify'; // Mở rộng: 'match', 'spell', 'fill-blank'

export interface QuizQuestion {
  id: string;
  type: QuizType;
  question: string;       // "Đâu là con bò?"
  correctItem: LessonItem;
  options: LessonItem[];  // 2 options hiện tại, mở rộng thành 4 sau
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  selectedItem: LessonItem;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  color: string;        // Tailwind background class
  textColor: string;    // Tailwind text class
  borderColor: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  categoryId: string;
  items: LessonItem[];
  quizCount: number;    // Số câu hỏi trong bài tập (default 10)
}

export type AppRoute =
  | '/'
  | `/lesson/${string}`
  | `/quiz/${string}`
  | `/result/${string}`;
