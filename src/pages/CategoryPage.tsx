import { useNavigate, useParams } from 'react-router-dom';
import { categories } from '../data/categories';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const category = categories.find((c) => c.id === categoryId);
  if (!category) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-200 to-yellow-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/')}
          className="bg-white rounded-2xl px-4 py-2 shadow-md font-black text-gray-600 hover:bg-gray-50 active:scale-95 transition-all text-lg"
        >
          ← Về nhà
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="text-6xl mb-2">{category.icon}</div>
        <h1 className={`text-4xl font-black ${category.textColor}`}>{category.title}</h1>
        <p className="text-gray-500 font-semibold mt-1">Chọn bài học nhé!</p>
      </div>

      {/* Lessons */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        {category.lessons.map((lesson, i) => (
          <button
            key={lesson.id}
            onClick={() => navigate(`/lesson/${lesson.id}`)}
            className={`
              ${category.color} border-4 ${category.borderColor} rounded-3xl p-6
              flex flex-col items-center gap-2 shadow-lg
              hover:scale-105 hover:shadow-xl active:scale-95
              transition-all duration-200 bounce-in
            `}
            style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
          >
            <span className="text-4xl">📖</span>
            <span className={`text-xl font-black ${category.textColor}`}>{lesson.title}</span>
            <span className="text-sm text-gray-500 font-semibold">
              {lesson.items.length} từ • {lesson.quizCount} câu hỏi
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
