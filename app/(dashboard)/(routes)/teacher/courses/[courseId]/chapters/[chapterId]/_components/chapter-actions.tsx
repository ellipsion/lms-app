"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

const ChapterActions: FC<ChapterActionsProps> = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}) => {
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const handleChapterDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}`
      );
      toast.success("Chapter Deleted");
      router.replace(`/teacher/courses/${courseId}`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const handleChapterPublish = async () => {
    try {
      setLoading(true);

      if (isPublished) {
        const response = await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
        toast.success("Chapter unpublished");
      } else {
        const response = await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
        toast.success("Chapter Published");
      }

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={handleChapterPublish}
        disabled={disabled || isLoading}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal
        onConfirm={handleChapterDelete}
        message="This action cannot be undone. This will permanently delete the chapter."
      >
        <Button size={"sm"} disabled={isLoading}>
          <TrashIcon className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterActions;
