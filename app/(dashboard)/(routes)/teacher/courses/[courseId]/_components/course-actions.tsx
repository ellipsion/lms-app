"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

const CourseActions: FC<CourseActionsProps> = ({
  disabled,
  courseId,
  isPublished,
}) => {
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const handleCourseDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/courses/${courseId}`);
      toast.success("Course Deleted");
      router.replace(`/teacher/courses/`);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const handleCoursePublish = async () => {
    try {
      setLoading(true);

      if (isPublished) {
        const response = await axios.patch(
          `/api/courses/${courseId}/unpublish`
        );
        toast.success("Course unpublished");
      } else {
        const response = await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Course Published");
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
        onClick={handleCoursePublish}
        disabled={disabled || isLoading}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"} Course
      </Button>
      <ConfirmModal
        onConfirm={handleCourseDelete}
        message="This action cannot be undone. This will permanently delete the course and all its chapters."
      >
        <Button size={"sm"} disabled={isLoading}>
          <TrashIcon className="size-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default CourseActions;
