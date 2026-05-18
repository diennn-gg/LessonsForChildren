import { useEffect, useState } from 'react';

interface FeedbackOverlayProps {
  type: 'correct' | 'wrong' | null;
  onDone: () => void;
}

const CORRECT_MESSAGES = ['Tuyệt vời! 🌟', 'Giỏi lắm! 🎉', 'Xuất sắc! ⭐', 'Đúng rồi! 🥳'];
const WRONG_MESSAGES = ['Thử lại nhé! 💪', 'Cố lên! 🌈', 'Sắp đúng rồi! 😊'];

export default function FeedbackOverlay({ type, onDone }: FeedbackOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!type) return;

    const msgs = type === 'correct' ? CORRECT_MESSAGES : WRONG_MESSAGES;
    setMessage(msgs[Math.floor(Math.random() * msgs.length)]);
    setVisible(true);

    const duration = type === 'correct' ? 2200 : 1200;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [type, onDone]);

  if (!type) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`${
          type === 'correct'
            ? 'bg-green-400 text-white'
            : 'bg-red-400 text-white'
        } rounded-3xl px-10 py-8 text-center shadow-2xl bounce-in`}
      >
        <div className="text-7xl mb-3">
          {type === 'correct' ? '⭐' : '😅'}
        </div>
        <div className="text-3xl font-black">{message}</div>

        {type === 'correct' && (
          <div className="mt-4 flex justify-center gap-2">
            {['🌟', '✨', '🌟', '✨', '🌟'].map((s, i) => (
              <span
                key={i}
                className="text-2xl"
                style={{ animation: `bounceIn 0.4s ${i * 0.1}s both` }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
