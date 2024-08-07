"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { CheckCircle, Undo2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface ProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted: boolean;
  nextChapterId: string | null;
}

const ProgressButton: FC<ProgressButtonProps> = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        { isCompleted: !isCompleted }
      );

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      router.refresh();
      toast.success("Progress updated");
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isCompleted ? (
        <Button
          onClick={handleComplete}
          disabled={isLoading}
          variant={"secondary"}
        >
          <Undo2Icon className="size-5 mr-2" /> Mark Uncomplete
        </Button>
      ) : (
        <Button
          onClick={handleComplete}
          disabled={isLoading}
          variant={"success"}
        >
          <CheckCircle className="size-5 mr-2" /> Mark Completed
        </Button>
      )}
    </>
  );
};

export default ProgressButton;
