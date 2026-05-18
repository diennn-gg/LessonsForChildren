import type { LessonItem } from '../../types';

interface ReadingOverlayProps {
  item: LessonItem | null;
  onSkip: () => void;
}

export default function ReadingOverlay({ item, onSkip }: ReadingOverlayProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onSkip}
    >
      <div
        className="bg-white rounded-3xl px-12 py-10 flex flex-col items-center gap-4 shadow-2xl bounce-in mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Emoji lớn */}
        <div className="leading-none select-none" style={{ fontSize: 200 }}>
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-52 h-52 object-contain" />
          ) : (
            item.emoji
          )}
        </div>

        {/* Tên */}
        <div className="text-4xl font-black text-gray-800 text-center">{item.name}</div>

        {/* Chỉ báo đang phát */}
        <div className="flex items-center gap-2 text-yellow-500 font-bold text-lg">
          <span className="float">🔊</span>
          <span>Đang đọc...</span>
        </div>

        {/* Bỏ qua */}
        <button
          onClick={onSkip}
          className="mt-2 text-gray-400 text-sm font-semibold hover:text-gray-600 underline"
        >
          Bỏ qua ›
        </button>
      </div>
    </div>
  );
}
