"use client";

import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/uploadthing/file-upload";

import { ImageIcon, Pencil, PlusCircleIcon } from "lucide-react";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const router = useRouter();
  const { imageUrl } = initialData;

  const toggleEditMode = () => setEditing((current) => !current);

  const handleFormSubmit = async (values: { imageUrl: string }) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Image Uploaded");
      toggleEditMode();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const editButton = (
    <Button onClick={toggleEditMode} variant={"ghost"}>
      {isEditing && (
        <span className="text-xs text-rose-700 font-semibold">Cancel</span>
      )}
      {!isEditing && imageUrl && (
        <>
          <Pencil className="h-4 w-4 mr-2 text-slate-500" />
          <span className="text-xs text-slate-500 font-semibold">
            Edit image
          </span>
        </>
      )}
      {!isEditing && !imageUrl && (
        <>
          <PlusCircleIcon className="h-4 w-4 mr-2 text-slate-500" />
          <span className="text-xs text-slate-500 font-semibold">
            Add image
          </span>
        </>
      )}
    </Button>
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        <p className="text-sm text-slate-500">Course Image</p>
        {editButton}
      </div>
      {!isEditing &&
        (!imageUrl ? (
          <DummyImage />
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="upload"
              fill
              className="object-cover rounded-md"
              src={imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) handleFormSubmit({ imageUrl: url });
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
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

export default ImageForm;
