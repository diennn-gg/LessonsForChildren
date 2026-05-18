interface StarRatingProps {
  score: number;
  total: number;
}

export default function StarRating({ score, total }: StarRatingProps) {
  const pct = score / total;
  let stars = 1;
  if (pct >= 0.9) stars = 3;
  else if (pct >= 0.6) stars = 2;

  return (
    <div className="flex justify-center gap-3 my-4">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`text-6xl transition-all duration-500 ${
            i <= stars ? 'opacity-100 scale-110' : 'opacity-30 grayscale'
          }`}
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
