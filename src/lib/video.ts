export type ParsedVideo =
  | { kind: "youtube" | "vimeo"; embedUrl: string }
  | { kind: "file"; src: string }
  | { kind: "unknown" };

export function parseVideo(url: string): ParsedVideo {
  if (!url) return { kind: "unknown" };

  if (/\.(mp4|webm|ogv|mov)(\?|$)/i.test(url)) {
    return { kind: "file", src: url };
  }

  let parsed: URL;
  try {
    parsed = new URL(url, "https://youtube.com");
  } catch {
    return { kind: "unknown" };
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    return id ? youtube(id) : { kind: "unknown" };
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const id =
      parsed.searchParams.get("v") ??
      parsed.pathname.match(/\/(?:embed|shorts|v)\/([\w-]+)/)?.[1];
    return id ? youtube(id) : { kind: "unknown" };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = parsed.pathname.match(/(\d+)/)?.[1];
    return id
      ? {
          kind: "vimeo",
          embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&api=1&title=0&byline=0&portrait=0`,
        }
      : { kind: "unknown" };
  }

  return { kind: "unknown" };
}

function youtube(id: string): ParsedVideo {
  return {
    kind: "youtube",
    embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
      id,
    )}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`,
  };
}

const YOUTUBE_ORIGINS = [
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
];

function parseMessageData(data: unknown): Record<string, unknown> | null {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  if (data && typeof data === "object") {
    return data as Record<string, unknown>;
  }
  return null;
}

/**
 * Watch a YouTube or Vimeo embed for play / pause / end so the invitation
 * soundtrack can duck while the film is on.
 */
export function subscribeToEmbedPlayback(
  iframe: HTMLIFrameElement,
  kind: "youtube" | "vimeo",
  onPlaying: (playing: boolean) => void,
): () => void {
  const target = kind === "youtube" ? "*" : "https://player.vimeo.com";

  const command = (payload: unknown) => {
    iframe.contentWindow?.postMessage(
      typeof payload === "string" ? payload : JSON.stringify(payload),
      target,
    );
  };

  const handshake = () => {
    if (kind === "youtube") {
      command({ event: "listening", id: 1 });
    } else {
      command({ method: "addEventListener", value: "play" });
      command({ method: "addEventListener", value: "pause" });
      command({ method: "addEventListener", value: "ended" });
    }
  };

  const retry = window.setInterval(handshake, 400);
  const giveUp = window.setTimeout(() => window.clearInterval(retry), 8000);

  const onMessage = (event: MessageEvent) => {
    if (kind === "youtube" && !YOUTUBE_ORIGINS.includes(event.origin)) return;
    if (kind === "vimeo" && event.origin !== "https://player.vimeo.com") return;

    const data = parseMessageData(event.data);
    if (!data) return;

    if (kind === "youtube") {
      if (data.event === "onReady") {
        window.clearInterval(retry);
        command({
          event: "command",
          func: "addEventListener",
          args: ["onStateChange"],
        });
        return;
      }

      const info = data.info;
      const state =
        data.event === "onStateChange" && typeof info === "number"
          ? info
          : data.event === "infoDelivery" &&
              info &&
              typeof info === "object" &&
              "playerState" in info &&
              typeof (info as { playerState: unknown }).playerState === "number"
            ? (info as { playerState: number }).playerState
            : null;

      /* 1 playing, 3 buffering — keep music down. 0 ended, 2 paused. */
      if (state === 1 || state === 3) onPlaying(true);
      if (state === 0 || state === 2) onPlaying(false);
      return;
    }

    if (data.event === "ready") window.clearInterval(retry);
    if (data.event === "play") onPlaying(true);
    if (data.event === "pause" || data.event === "ended") onPlaying(false);
  };

  window.addEventListener("message", onMessage);
  iframe.addEventListener("load", handshake);
  handshake();

  return () => {
    window.clearInterval(retry);
    window.clearTimeout(giveUp);
    window.removeEventListener("message", onMessage);
    iframe.removeEventListener("load", handshake);
  };
}
