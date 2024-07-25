import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs";

import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import TitleForm from "./_components/title-form";

import { IconBadge } from "@/components/custom/icon-badge";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentsForm from "./_components/attachments-form";
import ChaptersForm from "./_components/chapters-form";

interface PageProps {
  params: {
    courseId: string;
  };
}

const CourseDetailPage = async ({ params }: PageProps) => {
  const { courseId } = params;
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const { title, description, price, imageUrl, categoryId, chapters } = course;

  const requiredFields = [
    title,
    description,
    price,
    imageUrl,
    categoryId,
    chapters.some((chapter) => chapter.isPublished),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course Setup</h1>
          <span>Complete all fields {completionText}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h1 className="text-xl">Customize your course</h1>
          </div>
          <TitleForm initialData={course} courseId={courseId} />
          <DescriptionForm initialData={course} courseId={courseId} />
          <ImageForm initialData={course} courseId={courseId} />
          <CategoryForm
            initialData={course}
            courseId={courseId}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h1 className="text-xl">Course chapters</h1>
            </div>
            <ChaptersForm initialData={course} courseId={courseId} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h1 className="text-xl">Sell your course</h1>
            </div>
            <PriceForm courseId={courseId} initialData={course} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h1 className="text-xl">Resources &amp; Attachments</h1>
            </div>
            <AttachmentsForm courseId={courseId} initialData={course} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
