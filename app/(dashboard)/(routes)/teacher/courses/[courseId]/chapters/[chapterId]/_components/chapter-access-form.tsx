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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Editor from "@/components/custom/editor";
import Preview from "@/components/custom/preview";
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

export const ChapterAccessForm = ({
  initialData,
  courseId,
}: ChapterAccessFormProps) => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const router = useRouter();
  const { isFree, id: chapterId } = initialData;

  const toggleEditMode = () => setEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { isFree },
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
      <form className="" onSubmit={form.handleSubmit(handleFormSubmit)}>
        <FormField
          control={form.control}
          name="isFree"
          render={({ field }) => (
            <FormItem className="w-full  my-3">
              <div className="flex items-center gap-3 border p-2 rounded-md">
                <FormControl>
                  <Checkbox
                    onCheckedChange={field.onChange}
                    checked={field.value}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormLabel>Free for preview</FormLabel>
              </div>
              <FormDescription>
                Check this box if you want this chapter to be available for free
                preview
              </FormDescription>
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
        <p className="text-sm text-slate-500">Chapter access</p>
        {editButton}
      </div>
      {isEditing && editForm}
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2 text-slate-500 italic border rounded-md p-2"
          )}
        >
          {isFree ? (
            <p>
              This chapter is <strong>free</strong> for preview
            </p>
          ) : (
            <p>
              This chapter requires a <strong>paid</strong> subscription.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
