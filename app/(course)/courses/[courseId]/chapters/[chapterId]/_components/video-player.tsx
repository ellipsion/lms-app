"use client";

import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, LockIcon } from "lucide-react";
import { FC, useState } from "react";

interface VideoPlayerProps {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string;
  title: string;
  isLocked: boolean;
  isCompleted?: boolean;
}

const VideoPlayer: FC<VideoPlayerProps> = ({
  chapterId,
  courseId,
  playbackId,
  title,
  nextChapterId,
  isLocked,
  isCompleted,
}) => {
  const [ready, setIsReady] = useState(false);
  return (
    <div className="relative aspect-video">
      {!isLocked && !ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="size-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <LockIcon className="size-8 " />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          className={cn(!ready && "hidden")}
          title={title}
          playbackId={playbackId}
          onCanPlay={() => setIsReady(true)}
          onEnded={() => {}}
          autoPlay
        />
      )}
    </div>
  );
};

export default VideoPlayer;
