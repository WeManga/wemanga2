import React, { useEffect, useRef } from "react";
import { Episode, Season } from "../types";
import AdBanner from "./AdBanner";
import ScrollingMessage from "./ScrollingMessage";
import { saveContinueWatching } from "../utils/cookies";

interface VideoPlayerProps {
  animeId: number;
  animeTitle: string;
  episode: Episode;
  season: Season;
  onBack: () => void;
  onNextEpisode: () => void;
  onPreviousEpisode: () => void;
  hasNextEpisode: boolean;
  hasPreviousEpisode: boolean;
  onProgress: (progress: number) => void;
  progress?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  animeId,
  animeTitle,
  episode,
  season,
  onBack,
  onNextEpisode,
  onPreviousEpisode,
  hasNextEpisode,
  hasPreviousEpisode,
  onProgress,
  progress,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const bannerUrl = season?.banner || episode.thumbnail || "";

  const getVideoType = (url: string) => {
    if (!url) return null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("vimeo.com")) return "vimeo";
    if (url.includes("sibnet.ru")) return "sibnet";
    if (url.includes("sendvid.com")) return "sendvid";
    if (url.match(/\.(mp4|webm|ogg)$/i)) return "video";
    return "unknown";
  };

  const videoType = getVideoType(episode.videoUrl);

  // Sauvegarde au démontage — fonctionne même pour les iframes
  useEffect(() => {
    return () => {
      if (animeId && season && episode) {
        saveContinueWatching({
          animeId,
          seasonId: season.id,
          episodeId: episode.id,
          animeTitle,
          episodeTitle: episode.title,
          progress: progress && progress > 0 ? progress : 0.2,
          timestamp: Date.now(),
        });
      }
    };
  }, [animeId, animeTitle, season, episode, progress]);

  // Gestion HTML5 video + sauvegarde régulière
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || videoType !== "video") return;

    const setInitialTime = () => {
      if (progress && !isNaN(progress) && videoEl.duration > 0) {
        videoEl.currentTime = progress * videoEl.duration;
      }
    };

    if (videoEl.readyState >= 1) {
      setInitialTime();
    } else {
      videoEl.addEventListener("loadedmetadata", setInitialTime);
    }

    let lastSave = 0;
    const handleTimeUpdate = () => {
      const currentProgress = videoEl.currentTime / videoEl.duration;
      if (!isNaN(currentProgress)) {
        onProgress(currentProgress);

        if (Date.now() - lastSave > 5000 && currentProgress > 0.01) {
          saveContinueWatching({
            animeId,
            seasonId: season.id,
            episodeId: episode.id,
            animeTitle,
            episodeTitle: episode.title,
            progress: currentProgress,
            timestamp: Date.now(),
          });
          lastSave = Date.now();
        }
      }
    };

    videoEl.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      videoEl.removeEventListener("timeupdate", handleTimeUpdate);
      videoEl.removeEventListener("loadedmetadata", setInitialTime);
    };
  }, [onProgress, videoType, progress, animeId, animeTitle, season, episode]);

  const getEmbedUrl = () => {
    try {
      if (videoType === "youtube") {
        const id = episode.videoUrl.includes("youtu.be")
          ? episode.videoUrl.split("youtu.be/")[1].split(/[?&]/)[0]
          : new URL(episode.videoUrl).searchParams.get("v");
        return `https://www.youtube.com/embed/${id}?autoplay=1&controls=1&rel=0`;
      }
      if (videoType === "vimeo") {
        const match = episode.videoUrl.match(/vimeo\.com\/(\d+)/);
        return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : null;
      }
      if (videoType === "sendvid") {
        const match = episode.videoUrl.match(/sendvid\.com\/([a-zA-Z0-9]+)/);
        return match ? `https://sendvid.com/embed/${match[1]}` : null;
      }
      return episode.videoUrl;
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans pb-10">
      <ScrollingMessage />

      <div className="px-6 pt-14">
        <button
          onClick={onBack}
          className="text-white hover:text-gray-300 bg-transparent px-2 py-1 rounded transition"
        >
          ← Retour
        </button>
      </div>

      {bannerUrl && (
        <div
          className="w-full h-[220px] mt-4 mb-4"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85)), url(${bannerUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <AdBanner id="playerTop" />

      <div className="flex justify-center mb-6">
        <div className="bg-black/70 px-6 py-2 rounded-lg text-xl font-semibold shadow-md">
          {episode.title}
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden bg-[#111] shadow-lg">
        <div className="relative pb-[56.25%]">
          {videoType === "video" && (
            <video
              ref={videoRef}
              src={episode.videoUrl}
              controls
              autoPlay
              className="absolute top-0 left-0 w-full h-full"
            />
          )}

          {(videoType === "youtube" || videoType === "vimeo" || videoType === "sendvid") && (() => {
            const embedUrl = getEmbedUrl();
            return embedUrl ? (
              <iframe
                src={embedUrl}
                title="Video Player"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            ) : (
              <p className="absolute top-0">Impossible de charger la vidéo</p>
            );
          })()}

          {videoType === "sibnet" && (
            <iframe
              src={episode.videoUrl}
              title="Sibnet Player"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen"
              className="absolute top-0 left-0 w-full h-full"
            />
          )}
        </div>

        <div className="flex justify-between items-center px-4 py-3 bg-[#222]">
          <button
            onClick={onPreviousEpisode}
            disabled={!hasPreviousEpisode}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              hasPreviousEpisode ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 cursor-not-allowed"
            }`}
          >
            ← Épisode précédent
          </button>
          <button
            onClick={onNextEpisode}
            disabled={!hasNextEpisode}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              hasNextEpisode ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 cursor-not-allowed"
            }`}
          >
            Épisode suivant →
          </button>
        </div>
      </div>

      <AdBanner id="playerBottom" />
    </div>
  );
};

export default VideoPlayer;
