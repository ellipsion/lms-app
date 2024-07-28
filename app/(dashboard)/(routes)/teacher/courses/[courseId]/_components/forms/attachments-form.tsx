"use client";

import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/uploadthing/file-upload";

import {
  File,
  ImageIcon,
  Loader,
  Loader2,
  Pencil,
  PlusCircleIcon,
  X,
} from "lucide-react";

interface AttachmentsFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

export const AttachmentsForm = ({
  initialData,
  courseId,
}: AttachmentsFormProps) => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const toggleEditMode = () => setEditing((current) => !current);

  const handleFormSubmit = async (values: { url: string }) => {
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/attachments`,
        values
      );
      toast.success("Attachment added");
      toggleEditMode();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteId(id);
      const response = await axios.delete(
        `/api/courses/${courseId}/attachments/${id}`
      );
      toast.success("Attachment deleted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setDeleteId(null);
    }
  };

  const editButton = (
    <Button onClick={toggleEditMode} variant={"ghost"}>
      {isEditing && (
        <span className="text-xs text-rose-700 font-semibold">Cancel</span>
      )}

      {!isEditing && (
        <>
          <PlusCircleIcon className="h-4 w-4 mr-2 text-slate-500" />
          <span className="text-xs text-slate-500 font-semibold">
            Add attachment
          </span>
        </>
      )}
    </Button>
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        <p className="text-sm text-slate-500">Course Attachments</p>
        {editButton}
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center w-full gap-x-2 p-3 bg-sky-100 border border-sky-200 text-sky-700 rounded-md"
                >
                  <File className="w-4 h-4 mr-2 flex-shrink-0" />
                  <p className="text-xs text-clamp-1 flex-1">
                    {attachment.name}
                  </p>
                  {deleteId === attachment.id && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {deleteId !== attachment.id && (
                    <button
                      className="mt-auto hover:opacity-75 transition"
                      onClick={() => handleDelete(attachment.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) handleFormSubmit({ url });
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};

const DummyImage = () => {
  return (
    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
      <ImageIcon className="h-10 w-10 text-slate-500" />
    </div>
  );
};
