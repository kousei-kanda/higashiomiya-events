// イベントIDと掲載画像の対応表。画像が用意されていないイベントは
// undefined を返し、呼び出し側で image_emoji 等のフォールバック表示に切り替える。
const EVENT_IMAGES: Record<string, string> = {
  "summer-festival-2026": "/images/sf_2026.jpg",
  "illumination-ceremony-2026": "/images/illumi_2026.jpg",
  "kitchen-car-2027": "/images/kc_2027.jpg",
};

export function getEventImageSrc(eventId: string): string | undefined {
  return EVENT_IMAGES[eventId];
}
