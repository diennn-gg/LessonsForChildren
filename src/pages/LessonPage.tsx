import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { findLesson } from '../data/categories';
import LessonGrid from '../components/lesson/LessonGrid';
import ReadingOverlay from '../components/lesson/ReadingOverlay';
import { speak, stopSpeaking } from '../utils/speech';
import type { LessonItem } from '../types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const stopRef = useRef(false);
  const playingRef = useRef(false);
  const [activeItem, setActiveItem] = useState<LessonItem | null>(null);
  const [showPlayBtn, setShowPlayBtn] = useState(false);

  const result = findLesson(lessonId ?? '');

  const startReading = useCallback(async (items: LessonItem[]) => {
    if (playingRef.current) return;
    playingRef.current = true;
    stopRef.current = false;
    setShowPlayBtn(false);

    for (const item of items) {
      if (stopRef.current) break;
      setActiveItem(item);
      await speak(item.id, item.pronunciation ?? item.name);
      if (stopRef.current) break;
      await delay(1500);
    }

    setActiveItem(null);
    playingRef.current = false;
  }, []);

  useEffect(() => {
    if (!result) return;
    stopRef.current = false;
    playingRef.current = false;

    // Thử autoplay sau 400ms, nếu bị block thì hiện nút
    const timer = setTimeout(async () => {
      try {
        // Kiểm tra bằng cách play audio im lặng trước
        const probe = new Audio('/audio/' + result.lesson.items[0].id + '.mp3');
        probe.volume = 0;
        await probe.play();
        probe.pause();
        probe.src = '';
        // Autoplay được phép → bắt đầu đọc
        startReading(result.lesson.items);
      } catch {
        // Bị block → hiện nút cho user tap
        setShowPlayBtn(true);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      stopRef.current = true;
      stopSpeaking();
      setActiveItem(null);
      playingRef.current = false;
    };
  }, [lessonId]);

  const handleSkip = () => {
    stopRef.current = true;
    stopSpeaking();
    setActiveItem(null);
    playingRef.current = false;
  };

  if (!result) {
    navigate('/');
    return null;
  }

  const { lesson, category } = result;

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-200 to-yellow-100">
      <ReadingOverlay item={activeItem} onSkip={handleSkip} />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => navigate(`/category/${lesson.categoryId}`)}
          className="bg-white rounded-2xl px-4 py-2 shadow font-black text-gray-600 hover:bg-gray-50 active:scale-95 transition-all text-base border border-gray-100"
        >
          ← Quay lại
        </button>
        <div className="text-base font-black text-gray-700">{lesson.title}</div>
        <div className={`text-sm font-bold ${category.textColor} bg-white rounded-xl px-3 py-1 shadow border border-gray-100`}>
          {lesson.items.length} từ
        </div>
      </div>

      {/* Nút nghe tất cả — hiện khi autoplay bị block */}
      {showPlayBtn && (
        <div className="text-center py-4">
          <button
            onClick={() => startReading(lesson.items)}
            className="bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-white font-black text-lg
              px-8 py-3 rounded-2xl shadow-lg border-4 border-yellow-300 transition-all inline-flex items-center gap-2"
          >
            ▶ Nghe tất cả
          </button>
        </div>
      )}

      {!showPlayBtn && !activeItem && (
        <div className="text-center py-3 text-sm text-gray-500 font-semibold">
          Nhấn vào từ để nghe lại 🔊
        </div>
      )}

      {/* Grid */}
      <div className="px-4 pb-6 max-w-4xl mx-auto w-full">
        <LessonGrid items={lesson.items} activeItemId={activeItem?.id ?? null} />
      </div>

      {/* Nút bài tập */}
      <div className="sticky bottom-0 pb-6 pt-3 px-4 max-w-4xl mx-auto w-full bg-linear-to-t from-yellow-100 to-transparent">
        <button
          onClick={() => { handleSkip(); navigate(`/quiz/${lesson.id}`); }}
          className="w-full bg-linear-to-r from-yellow-400 to-orange-400 text-white text-xl font-black
            py-5 rounded-3xl shadow-xl hover:shadow-2xl active:scale-95 transition-all border-4 border-yellow-300"
        >
          🎯 Bắt đầu làm bài tập!
        </button>
        <div className="text-center text-gray-500 font-semibold text-sm mt-2">
          {lesson.quizCount} câu hỏi đang chờ bạn 🌟
        </div>
      </div>
    </div>
  );
}
