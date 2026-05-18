import { useState } from 'react';
import { speak } from '../../utils/speech';
import type { LessonItem } from '../../types';

interface ItemCardProps {
  item: LessonItem;
  isActive?: boolean;
  onClick?: () => void;
}

export default function ItemCard({ item, isActive, onClick }: ItemCardProps) {
  const [playing, setPlaying] = useState(false);

  const handleClick = async () => {
    if (playing) return;
    setPlaying(true);
    onClick?.();
    await speak(item.id, item.pronunciation ?? item.name);
    setPlaying(false);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex flex-col items-center justify-between gap-2
        bg-white rounded-3xl p-4 shadow-md border-4 cursor-pointer
        transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-95
        ${playing ? 'border-yellow-400 shadow-yellow-200' : ''}
        ${isActive && !playing ? 'border-yellow-400' : ''}
        ${!isActive && !playing ? 'border-transparent hover:border-yellow-300' : ''}
      `}
      style={{ minHeight: 180 }}
    >
      {/* Speaker badge */}
      <div className={`self-end text-lg transition-all ${playing ? 'opacity-100' : 'opacity-0'}`}>
        🔊
      </div>

      {/* Emoji / Image — cố định size để đồng đều */}
      <div className="flex items-center justify-center w-full" style={{ height: 80 }}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="max-h-20 w-auto object-contain" />
        ) : (
          <span className="text-6xl leading-none select-none">{item.emoji}</span>
        )}
      </div>

      {/* Name */}
      <div className="text-lg font-black text-gray-700 text-center leading-tight px-1">
        {item.name}
      </div>

      {/* Tap to hear */}
      <div className={`text-xs font-semibold pb-1 transition-colors ${playing ? 'text-yellow-500' : 'text-gray-400'}`}>
        {playing ? '🎵 Đang phát...' : 'Nhấn để nghe'}
      </div>
    </button>
  );
}
