import { useEffect, useRef } from "react";

/**
 * Shopify serves uploaded video media as an adaptive HLS stream
 * (`/cdn/shop/videos/....m3u8`), and native `<video src>` playback of HLS only
 * works in Safari/iOS. Everywhere else the element never leaves readyState 0,
 * which reads to the client as "the video is broken".
 *
 * So the source is attached from an effect instead of the `src` attribute:
 * Safari (and any progressive file such as .mp4) gets the plain URL, and every
 * other browser gets the same stream through hls.js via MediaSource. hls.js is
 * imported dynamically so the ~400 kB player only loads on pages that actually
 * render a stream that needs it.
 */
function canPlayHlsNatively(video: HTMLVideoElement) {
  const support = video.canPlayType("application/vnd.apple.mpegurl");
  return support === "maybe" || support === "probably";
}

function isHlsSource(src: string) {
  try {
    return new URL(src, window.location.href).pathname
      .toLowerCase()
      .endsWith(".m3u8");
  } catch {
    return false;
  }
}

type HlsVideoProps = {
  src: string;
  poster?: string;
  className?: string;
};

export function HlsVideo({ src, poster, className }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isHlsSource(src) || canPlayHlsNatively(video)) {
      video.src = src;
      return;
    }

    let cancelled = false;
    let player: { destroy: () => void } | null = null;

    void import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      if (!Hls.isSupported()) {
        // No MediaSource either — hand the URL over and let the browser try.
        video.src = src;
        return;
      }
      const hls = new Hls();
      player = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
    });

    return () => {
      cancelled = true;
      player?.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      playsInline
      preload="metadata"
      poster={poster}
      className={className}
    />
  );
}
