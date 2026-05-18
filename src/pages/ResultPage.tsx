import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { findLesson } from '../data/categories';
import StarRating from '../components/common/StarRating';
import type { QuizResult } from '../types';

interface LocationState {
  results: QuizResult[];
  total: number;
}

export default function ResultPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const result = findLesson(lessonId ?? '');

  if (!result || !state) {
    navigate('/');
    return null;
  }

  const { lesson, category } = result;
  const { results, total } = state;
  const correctCount = results.filter((r) => r.correct).length;
  const pct = Math.round((correctCount / total) * 100);

  const getMessage = () => {
    if (pct === 100) return { text: 'Hoàn hảo! Bạn giỏi quá!', emoji: '🏆' };
    if (pct >= 80) return { text: 'Tuyệt vời! Cố lên nhé!', emoji: '🌟' };
    if (pct >= 60) return { text: 'Giỏi lắm! Tiếp tục nào!', emoji: '💪' };
    return { text: 'Cố lên! Thử lại nhé!', emoji: '🌈' };
  };

  const { text, emoji } = getMessage();

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-200 to-yellow-100 p-6 flex flex-col items-center">
      {/* Big result display */}
      <div className="text-center mt-8 mb-6 bounce-in">
        <div className="text-9xl mb-4">{emoji}</div>
        <h1 className="text-4xl font-black text-purple-700">{text}</h1>
      </div>

      {/* Score card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border-4 border-yellow-200 text-center mb-6">
        <div className="text-7xl font-black text-orange-500 mb-2">
          {correctCount}<span className="text-4xl text-gray-400">/{total}</span>
        </div>
        <div className="text-2xl font-black text-gray-600 mb-4">câu đúng</div>

        <StarRating score={correctCount} total={total} />

        {/* Score bar */}
        <div className="mt-4 bg-gray-100 rounded-full h-6 overflow-hidden">
          <div
            className={`h-6 rounded-full transition-all duration-1000 ${
              pct >= 80 ? 'bg-green-400' : pct >= 60 ? 'bg-yellow-400' : 'bg-orange-400'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className={`text-lg font-black mt-2 ${category.textColor}`}>{pct}%</div>
      </div>

      {/* Results list */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-5 border-4 border-gray-100 mb-8">
        <h3 className="text-lg font-black text-gray-600 mb-3">Chi tiết kết quả:</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 text-base">
              <span>{r.correct ? '✅' : '❌'}</span>
              <span className="text-3xl">{r.selectedItem.emoji}</span>
              <span className="font-bold text-gray-700">{r.selectedItem.name}</span>
              {!r.correct && (
                <span className="text-gray-400 text-sm ml-auto">sai</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => navigate(`/quiz/${lesson.id}`)}
          className="flex-1 bg-linear-to-r from-orange-400 to-red-400 text-white text-xl font-black
            px-6 py-4 rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-orange-300"
        >
          🔄 Làm lại
        </button>
        <button
          onClick={() => navigate(`/category/${lesson.categoryId}`)}
          className="flex-1 bg-linear-to-r from-purple-400 to-pink-400 text-white text-xl font-black
            px-6 py-4 rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-purple-300"
        >
          📚 Bài khác
        </button>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-4 text-gray-500 font-bold hover:text-gray-700 underline"
      >
        🏠 Về trang chính
      </button>
    </div>
  );
}
