import type { LessonItem } from '../../types';
import ItemCard from './ItemCard';

interface LessonGridProps {
  items: LessonItem[];
  activeItemId: string | null;
}

export default function LessonGrid({ items, activeItemId }: LessonGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="bounce-in w-full"
          style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
        >
          <ItemCard item={item} isActive={activeItemId === item.id} />
        </div>
      ))}
    </div>
  );
}
