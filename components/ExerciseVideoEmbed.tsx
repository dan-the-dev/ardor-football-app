import { extractYouTubeVideoId } from "@/lib/youtube";

export function ExerciseVideoEmbed({ videoUrl }: { videoUrl: string | null }) {
  const videoId = extractYouTubeVideoId(videoUrl);
  if (!videoId) return null;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-ardor-gray" style={{ aspectRatio: "16/9" }}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="Video esercizio"
        className="h-full w-full"
        style={{ width: "100%", aspectRatio: "16/9" }}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}
