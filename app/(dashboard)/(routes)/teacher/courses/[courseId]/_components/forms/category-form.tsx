"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Course } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required" }),
});

export const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const router = useRouter();
  const { categoryId } = initialData;
  const selectedOption = options.find((option) => option.value === categoryId);

  const toggleEditMode = () => setEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { categoryId: categoryId || "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course Updated");
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
          name="categoryId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Combobox options={options} {...field} name="category" />
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
        <p className="text-sm text-slate-500">Course Category</p>
        {editButton}
      </div>
      {isEditing && editForm}
      {!isEditing && (
        <p
          className={cn("text-sm mt-2", !categoryId && "text-slate-500 italic")}
        >
          {selectedOption?.label || "No category"}
        </p>
      )}
    </div>
  );
};
