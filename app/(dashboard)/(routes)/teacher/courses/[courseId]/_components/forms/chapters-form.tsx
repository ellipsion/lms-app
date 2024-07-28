"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Chapter, Course } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2Icon, Pencil, PlusCircle } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { ChaptersList } from "../chapters-list";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setCreating] = useState<boolean>(false);
  const [isUpdating, setUpdating] = useState<boolean>(false);
  const router = useRouter();
  const { description } = initialData;

  const toggleCreating = () => setCreating((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/chapters`,
        values
      );
      toast.success("Chapter created");
      toggleCreating();
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setUpdating(true);
      const response = await axios.put(
        `/api/courses/${courseId}/chapters/reorder`,
        { list: updateData }
      );
      // toast.success("Chapters reordered");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong reordering chapters");
    } finally {
      setUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  const editButton = (
    <Button onClick={toggleCreating} variant={"ghost"}>
      {isCreating ? (
        <span className="text-xs text-rose-500 font-semibold">Cancel</span>
      ) : (
        <>
          <PlusCircle className="h-4 w-4 mr-2 text-slate-500" />
          <span className="text-xs text-slate-500 font-semibold">
            Add a chapter
          </span>
        </>
      )}
    </Button>
  );

  const editForm = (
    <Form {...form}>
      <form
        className="flex gap-x-2"
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="Chapter title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" disabled={!isValid || isSubmitting}>
          Add
        </Button>
      </form>
    </Form>
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        <p className="text-sm text-slate-500">Course Chapters</p>
        {editButton}
      </div>

      {!isCreating && !initialData.chapters.length && (
        <p className={"text-sm mt-2 ml-2 text-slate-500 italic"}>No chapters</p>
      )}
      {initialData.chapters.length > 0 && (
        <div className="relative">
          {/* {isUpdating && (
            <div className="absolute w-full h-full rounded flex justify-center items-center z-10 bg-white/10 backdrop-blur-sm">
              <Loader2Icon className="w-5 h-5 animate-spin stroke-slate-500" />
            </div>
          )} */}
          <ChaptersList
            items={initialData.chapters || []}
            onEdit={onEdit}
            onReorder={onReorder}
          />
        </div>
      )}
      {isCreating && editForm}
      {!isCreating && (
        <p className={"text-xs mt-4 text-muted-foreground"}>
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};
