import { useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-200 to-yellow-100 p-6">
      {/* Header */}
      <div className="text-center mb-10 pt-4">
        <div className="text-7xl mb-4 float">🌟</div>
        <h1 className="text-5xl font-black text-purple-700 drop-shadow-sm">Bé Học Vui</h1>
        <p className="text-xl text-purple-500 font-bold mt-2">Chọn chủ đề bạn muốn học nhé!</p>
      </div>

      {/* Categories */}
      <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-2 gap-5">
        {categories.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
            className={`
              ${cat.color} border-4 ${cat.borderColor} rounded-3xl p-6
              flex flex-col items-center gap-3 shadow-lg
              hover:scale-105 hover:shadow-xl active:scale-95
              transition-all duration-200 bounce-in
            `}
            style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
          >
            <span className="text-6xl">{cat.icon}</span>
            <span className={`text-2xl font-black ${cat.textColor}`}>{cat.title}</span>
            <span className="text-sm text-gray-500 font-semibold">
              {cat.lessons.length} bài học
            </span>
          </button>
        ))}
      </div>

      {/* Footer decoration */}
      <div className="text-center mt-12 text-4xl opacity-40 select-none">
        🌈 ⭐ 🎈 ⭐ 🌈
      </div>
    </div>
  );
}
