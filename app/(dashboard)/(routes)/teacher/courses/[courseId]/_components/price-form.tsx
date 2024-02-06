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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/formats";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const router = useRouter();
  const { price } = initialData;

  const toggleEditMode = () => setEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { price: price || undefined },
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
          name="price"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  type="number"
                  step={0.01}
                  placeholder="Set a price for your course"
                  {...field}
                />
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
        <p className="text-sm text-slate-500">Course Price</p>
        {editButton}
      </div>
      {isEditing && editForm}
      {!isEditing && (
        <p className={cn("text-sm mt-2", !price && "text-slate-500 italic")}>
          {price ? formatPrice(price) : "No price"}
        </p>
      )}
    </div>
  );
};

export default PriceForm;
