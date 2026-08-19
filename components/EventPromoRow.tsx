// 3行を超える場合に3行目で「・・・」と表示するための概算文字数トリム
// （実際の折返し幅に応じた厳密な行数計算ではなく、デザイン上の簡易実装）
const DESCRIPTION_MAX_CHARS = 84;

function truncateDescription(text: string): string {
  if (text.length <= DESCRIPTION_MAX_CHARS) return text;
  return `${text.slice(0, DESCRIPTION_MAX_CHARS)}・・・`;
}

export default function EventPromoRow({
  imageSrc,
  imageEmoji,
  imageAlt,
  title,
  eventDateText,
  deadlineText,
  description,
}: {
  imageSrc?: string;
  imageEmoji: string;
  imageAlt: string;
  title: string;
  eventDateText: string;
  deadlineText: string;
  description: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 py-8">
      <div className="sm:w-[30%] shrink-0">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-48 sm:h-full object-cover rounded-lg bg-line"
          />
        ) : (
          <div
            className="w-full h-48 sm:h-full rounded-lg bg-line flex items-center justify-center text-5xl"
            aria-hidden
          >
            {imageEmoji}
          </div>
        )}
      </div>
      <div className="sm:w-[70%] flex flex-col">
        <h3 className="font-display font-bold text-lg sm:text-xl text-text">
          {title}
        </h3>
        <p className="mt-2 text-sm text-text-dim">開催日　{eventDateText}</p>
        <p className="mt-1 text-sm">
          <span className="inline-block bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded">
            締切　{deadlineText}
          </span>
        </p>
        <p className="mt-3 text-sm text-text leading-relaxed">
          {truncateDescription(description)}
        </p>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="rounded-full bg-green px-6 py-2 text-sm font-bold text-white"
          >
            応募に進む
          </button>
        </div>
      </div>
    </div>
  );
}
