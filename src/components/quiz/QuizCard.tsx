import { useState, useEffect } from 'react';
import type { QuizQuestion, LessonItem } from '../../types';
import { speak } from '../../utils/speech';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (item: LessonItem, correct: boolean) => void;
  answered: boolean;
  selectedId: string | null;
}

export default function QuizCard({ question, onAnswer, answered, selectedId }: QuizCardProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Tự đọc câu hỏi mỗi khi câu hỏi mới xuất hiện
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(`q-${question.correctItem.id}`);
    }, 800);
    return () => clearTimeout(timer);
  }, [question.id]);

  const handleSelect = (item: LessonItem) => {
    if (answered) return;
    const correct = item.id === question.correctItem.id;
    speak(correct ? 'dung-roi' : 'thu-lai');
    onAnswer(item, correct);
  };

  const getBorderClass = (item: LessonItem) => {
    if (!answered) {
      return hovered === item.id ? 'border-yellow-400 scale-105' : 'border-gray-200';
    }
    if (item.id === question.correctItem.id) return 'border-green-400 bg-green-50 pulse-correct';
    if (item.id === selectedId) return 'border-red-400 bg-red-50 shake';
    return 'border-gray-200 opacity-50';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Question — nhấn để nghe lại */}
      <button
        onClick={() => speak(`q-${question.correctItem.id}`)}
        className="w-full text-center mb-8 group"
      >
        <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-md border-2 border-yellow-200 hover:border-yellow-400 transition-all">
          <span className="text-3xl font-black text-gray-800">{question.question}</span>
          <span className="text-2xl opacity-100 group-hover:scale-125 transition-transform">🔊</span>
        </div>
      </button>

      {/* Options */}
      <div className="grid grid-cols-2 gap-6">
        {question.options.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            onMouseEnter={() => !answered && setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            disabled={answered}
            className={`
              flex flex-col items-center justify-center gap-4
              bg-white rounded-3xl p-8 shadow-lg border-4
              transition-all duration-200 cursor-pointer
              ${answered ? 'cursor-default' : 'hover:shadow-xl active:scale-95'}
              ${getBorderClass(item)}
            `}
            style={{ minHeight: 220 }}
          >
            <div className="text-8xl leading-none select-none">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-contain" />
              ) : (
                item.emoji
              )}
            </div>

            {answered && (
              <div className="text-xl font-black text-gray-700">{item.name}</div>
            )}

            {answered && item.id === question.correctItem.id && (
              <div className="text-green-500 text-3xl">✓</div>
            )}
            {answered && item.id === selectedId && item.id !== question.correctItem.id && (
              <div className="text-red-500 text-3xl">✗</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
