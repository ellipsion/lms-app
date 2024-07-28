"use client";

import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import MuxPlayer from "@mux/mux-player-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Chapter, Course, MuxData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/uploadthing/file-upload";

import { ImageIcon, Pencil, PlusCircleIcon, VideoIcon } from "lucide-react";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData: MuxData | null };
  courseId: string;
}

export const ChapterVideoForm = ({
  initialData,
  courseId,
}: ChapterVideoFormProps) => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const router = useRouter();
  const { videoUrl } = initialData;
  const chapterId = initialData.id;

  const toggleEditMode = () => setEditing((current) => !current);

  const handleFormSubmit = async (values: { videoUrl: string }) => {
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Video Uploaded");
      // toggleEditMode();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      toggleEditMode();
    }
  };

  const editButton = (
    <Button onClick={toggleEditMode} variant={"ghost"}>
      {isEditing && (
        <span className="text-xs text-rose-700 font-semibold">Cancel</span>
      )}
      {!isEditing && videoUrl && (
        <>
          <Pencil className="h-4 w-4 mr-2 text-slate-500" />
          <span className="text-xs text-slate-500 font-semibold">
            Change video
          </span>
        </>
      )}
      {!isEditing && !videoUrl && (
        <>
          <PlusCircleIcon className="h-4 w-4 mr-2 text-slate-500" />
          <span className="text-xs text-slate-500 font-semibold">
            Add video
          </span>
        </>
      )}
    </Button>
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        <p className="text-sm text-slate-500">Course Video</p>
        {editButton}
      </div>
      {!isEditing &&
        (!videoUrl ? (
          <DummyVideo />
        ) : (
          <div className="relative mt-2 w-full aspect-video">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
            <div className="text-xs text-muted-foreground mt-4">
              Videos can take a few minutes to process. Refresh the page if
              video does not appear.
            </div>
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chaptervideo"
            onChange={(url) => {
              if (url) handleFormSubmit({ videoUrl: url });
            }}
          />
        </div>
      )}
    </div>
  );
};

const DummyVideo = () => {
  return (
    <div className="flex items-center justify-center h-72 bg-slate-200 rounded-md">
      <VideoIcon className="h-10 w-10 text-slate-500" />
    </div>
  );
};
