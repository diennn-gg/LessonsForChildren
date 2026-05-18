import { useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { findLesson } from '../data/categories';
import { generateQuizQuestions } from '../utils/quiz';
import QuizCard from '../components/quiz/QuizCard';
import FeedbackOverlay from '../components/common/FeedbackOverlay';
import ProgressBar from '../components/common/ProgressBar';
import type { LessonItem, QuizResult } from '../types';

export default function QuizPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const result = findLesson(lessonId ?? '');
  if (!result) {
    navigate('/');
    return null;
  }

  const { lesson, category } = result;

  const [questions] = useState(() =>
    generateQuizQuestions(lesson.items, lesson.quizCount)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [lastCorrect, setLastCorrect] = useState(false);

  // Dùng ref để tránh stale closure khi navigate
  const resultsRef = useRef<QuizResult[]>([]);
  const correctCountRef = useRef(0);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = useCallback((item: LessonItem, correct: boolean) => {
    setAnswered(true);
    setSelectedId(item.id);
    setFeedback(correct ? 'correct' : 'wrong');
    setLastCorrect(correct);

    if (correct) {
      correctCountRef.current += 1;
      resultsRef.current = [
        ...resultsRef.current,
        { questionId: currentQuestion.id, correct: true, selectedItem: item },
      ];
    }
  }, [currentQuestion.id]);

  const handleFeedbackDone = useCallback(() => {
    setFeedback(null);

    if (!lastCorrect) {
      // Sai → reset để bé thử lại, KHÔNG chuyển câu
      setAnswered(false);
      setSelectedId(null);
      return;
    }

    // Đúng → chuyển câu tiếp hoặc kết thúc
    if (isLastQuestion) {
      navigate(`/result/${lesson.id}`, {
        state: {
          results: resultsRef.current,
          correct: correctCountRef.current,
          total: questions.length,
        },
      });
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
      setSelectedId(null);
    }
  }, [lastCorrect, isLastQuestion, navigate, lesson.id, questions.length]);

  const goNext = () => {
    if (isLastQuestion) {
      navigate(`/result/${lesson.id}`, {
        state: {
          results: resultsRef.current,
          correct: correctCountRef.current,
          total: questions.length,
        },
      });
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-200 to-yellow-100 p-6">
      <FeedbackOverlay type={feedback} onDone={handleFeedbackDone} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/lesson/${lesson.id}`)}
          className="bg-white rounded-2xl px-4 py-2 shadow-md font-black text-gray-600 hover:bg-gray-50 active:scale-95 transition-all text-lg"
        >
          ← Xem lại bài
        </button>
        <div className={`text-lg font-black ${category.textColor}`}>
          Câu {currentIndex + 1} / {questions.length}
        </div>
        <div className="text-2xl">🎯</div>
      </div>

      {/* Progress — chỉ tính câu đúng */}
      <div className="max-w-2xl mx-auto mb-8">
        <ProgressBar current={currentIndex} total={questions.length} color="bg-yellow-400" />
      </div>

      {/* Quiz Card */}
      <div className="max-w-2xl mx-auto">
        <QuizCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          answered={answered}
          selectedId={selectedId}
        />
      </div>

      {/* Nút tiếp theo — chỉ hiện khi trả lời ĐÚNG và feedback đã xong */}
      {answered && lastCorrect && !feedback && (
        <div className="text-center mt-8">
          <button
            onClick={goNext}
            className="bg-linear-to-r from-green-400 to-teal-400 text-white text-xl font-black
              px-8 py-4 rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-green-300"
          >
            {isLastQuestion ? '🏆 Xem kết quả' : '➡️ Câu tiếp theo'}
          </button>
        </div>
      )}

      {/* Gợi ý khi trả lời sai và feedback đã xong */}
      {answered && !lastCorrect && !feedback && (
        <div className="text-center mt-8">
          <div className="inline-block bg-orange-100 border-4 border-orange-300 rounded-3xl px-8 py-4">
            <span className="text-2xl font-black text-orange-600">💪 Thử lại nhé bạn ơi!</span>
          </div>
        </div>
      )}
    </div>
  );
}
