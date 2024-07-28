"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Chapter, Course } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Editor from "@/components/custom/editor";
import Preview from "@/components/custom/preview";

interface ChapterDescriptionFormProps {
  initialData: Chapter;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

export const ChapterDescriptionForm = ({
  initialData,
  courseId,
}: ChapterDescriptionFormProps) => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const router = useRouter();
  const { description, id: chapterId } = initialData;

  const toggleEditMode = () => setEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: description || "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter Updated");
      toggleEditMode();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const editButton = (
    <Button onClick={toggleEditMode} variant={"ghost"}>
      {isEditing ? (
        <span className="text-xs text-rose-500 font-semibold">Cancel</span>
      ) : (
        <>
          <Pencil className="h-4 w-4 mr-2 text-slate-500" />
          <span className="text-xs text-slate-500 font-semibold">Edit</span>
        </>
      )}
    </Button>
  );

  const editForm = (
    <Form {...form}>
      <form className="min-h-10" onSubmit={form.handleSubmit(handleFormSubmit)}>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Editor {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-2">
          <Button type="submit" size="sm" disabled={!isValid || isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        <p className="text-sm text-slate-500">Chapter Description</p>
        {editButton}
      </div>
      {isEditing && editForm}
      {!isEditing && (
        <div
          onClick={() => (!description ? toggleEditMode() : null)}
          className={cn(
            "relative text-sm mt-2 bg-white text-black rounded-md border min-h-32"
          )}
        >
          <Preview value={description || ""} />
          {!description && (
            <p className="absolute top-2 left-2 italic text-slate-500">
              Add a description...
            </p>
          )}
        </div>
      )}
    </div>
  );
};
