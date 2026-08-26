"use client";

import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VideoPlayerProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  className?: string;
  volume?: number;
};

const CONTROLS_IDLE_TIMEOUT = 2000;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "00:00";

  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export function VideoPlayer({
  className,
  onPlay,
  onPause,
  onTimeUpdate,
  onLoadedMetadata,
  onVolumeChange,
  ...videoProps
}: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const clickTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const idleTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(videoProps.volume ?? 1);
  const [controlsVisible, setControlsVisible] = React.useState(true);

  const clearIdleTimeout = React.useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  }, []);

  const resetIdleTimer = React.useCallback(() => {
    setControlsVisible(true);
    clearIdleTimeout();

    // Keep controls visible while the video is paused.
    if (!videoRef.current || videoRef.current.paused) {
      return;
    }

    idleTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, CONTROLS_IDLE_TIMEOUT);
  }, [clearIdleTimeout]);

  React.useEffect(() => {
    return () => {
      clearIdleTimeout();

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [clearIdleTimeout]);

  const togglePlay = React.useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }, []);

  const toggleFullscreen = React.useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
      }
    } catch {
      // Fullscreen can be rejected by the browser.
    }
  }, []);

  /*
   * A single click is delayed slightly so that a double click
   * can be distinguished from two single clicks.
   */
  const handleVideoClick = () => {
    resetIdleTimer();

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      togglePlay();
      clickTimeoutRef.current = null;
    }, 200);
  };

  const handleVideoDoubleClick = () => {
    resetIdleTimer();

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    void toggleFullscreen();
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetIdleTimer();

    const video = videoRef.current;
    if (!video) return;

    const time = Number(event.target.value);

    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    resetIdleTimer();

    const video = videoRef.current;
    if (!video) return;

    const nextVolume = Number(event.target.value);

    video.volume = nextVolume;
    video.muted = nextVolume === 0;

    setVolume(nextVolume);
  };

  const toggleMute = () => {
    resetIdleTimer();

    const video = videoRef.current;
    if (!video) return;

    if (video.muted || video.volume === 0) {
      video.muted = false;
      video.volume = volume || 1;
      setVolume(video.volume);
    } else {
      video.muted = true;
    }
  };

  const handlePlay = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    setIsPlaying(true);
    resetIdleTimer();

    onPlay?.(event);
  };

  const handlePause = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    setIsPlaying(false);
    setControlsVisible(true);
    clearIdleTimeout();

    onPause?.(event);
  };

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(event.currentTarget.currentTime);
    onTimeUpdate?.(event);
  };

  const handleLoadedMetadata = (
    event: React.SyntheticEvent<HTMLVideoElement>,
  ) => {
    console.log({ event });
    setDuration(event.currentTarget.duration);
    setVolume(event.currentTarget.volume);

    onLoadedMetadata?.(event);
  };

  const handleVideoVolumeChange = (
    event: React.SyntheticEvent<HTMLVideoElement>,
  ) => {
    const video = event.currentTarget;

    setVolume(video.volume);

    onVolumeChange?.(event);
  };

  const handleVideoKeyDown = (event: React.KeyboardEvent<HTMLVideoElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      togglePlay();
      resetIdleTimer();
      return;
    }

    if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      void toggleFullscreen();
      resetIdleTimer();
    }
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: a rich media element can't be contained in a button
    <div
      ref={containerRef}
      onMouseMove={resetIdleTimer}
      onMouseEnter={resetIdleTimer}
      onTouchStart={resetIdleTimer}
      className={cn(
        "group relative w-full overflow-hidden",
        "border-2 border-border bg-black",
        "shadow-[8px_8px_0_0_#000]",
        !controlsVisible && "cursor-none",
        className,
      )}
    >
      <video
        ref={videoRef}
        {...videoProps}
        controls={false}
        onClick={handleVideoClick}
        onDoubleClick={handleVideoDoubleClick}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onVolumeChange={handleVideoVolumeChange}
        tabIndex={0}
        onKeyDown={handleVideoKeyDown}
        playsInline
        className={cn(
          "block aspect-video w-full bg-black object-contain",
          className,
        )}
      />

      {/* Controls */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-black p-3",
          "transition-opacity duration-200",
          controlsVisible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        {/* Progress */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleTimeChange}
          aria-label="Video progress"
          className={cn(
            "mb-3 block h-3 w-full cursor-pointer appearance-none",
            "border-2 border-black bg-white",
            "[&::-webkit-slider-thumb]:size-4",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:rounded-none",
            "[&::-webkit-slider-thumb]:border-2",
            "[&::-webkit-slider-thumb]:border-black",
            "[&::-webkit-slider-thumb]:bg-primary",
            "[&::-moz-range-thumb]:size-4",
            "[&::-moz-range-thumb]:rounded-none",
            "[&::-moz-range-thumb]:border-2",
            "[&::-moz-range-thumb]:border-black",
            "[&::-moz-range-thumb]:bg-primary",
          )}
        />

        <div className="flex items-center gap-3">
          {/* Play / Pause */}
          <Button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            size={"icon-sm"}
            variant={"neutralNoShadow"}
          >
            {isPlaying ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 fill-current" />
            )}
          </Button>

          {/* Time */}
          <span className="text-sm font-bold text-white tabular-nums">
            {formatTime(currentTime)}
            <span className="mx-1 text-primary">/</span>
            {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Button
              variant={"neutralNoShadow"}
              size={"icon-sm"}
              onClick={toggleMute}
              aria-label={volume === 0 ? "Unmute" : "Mute"}
            >
              {volume === 0 || videoRef.current?.muted ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4" />
              )}
            </Button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Volume"
              className={cn(
                "hidden h-2 w-20 cursor-pointer appearance-none sm:block",
                "border border-white bg-white",
                "[&::-webkit-slider-thumb]:size-3",
                "[&::-webkit-slider-thumb]:appearance-none",
                "[&::-webkit-slider-thumb]:rounded-none",
                "[&::-webkit-slider-thumb]:bg-primary",
                "[&::-moz-range-thumb]:size-3",
                "[&::-moz-range-thumb]:rounded-none",
                "[&::-moz-range-thumb]:border-0",
                "[&::-moz-range-thumb]:bg-primary",
              )}
            />
          </div>

          {/* Fullscreen */}

          <Button
            variant={"neutralNoShadow"}
            size={"icon-sm"}
            onClick={toggleFullscreen}
            aria-label="Fullscreen"
          >
            <Maximize className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
