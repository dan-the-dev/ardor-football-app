import { extractYouTubeVideoId } from "@/lib/youtube";

export function ExerciseVideoPreview({ videoUrl }: { videoUrl: string | null }) {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) return null;

  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&controls=0&disablekb=1&modestbranding=1`;

  return (
    <iframe
      src={src}
      title="Anteprima video"
      tabIndex={-1}
      aria-hidden
      className="pointer-events-none h-full w-full"
      style={{ width: "100%", aspectRatio: "16/9" }}
    />
  );
}
