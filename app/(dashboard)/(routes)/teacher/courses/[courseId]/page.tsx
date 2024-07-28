import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs";

import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
  UploadIcon,
} from "lucide-react";

import { IconBadge } from "@/components/custom/icon-badge";
import {
  TitleForm,
  DescriptionForm,
  ImageForm,
  CategoryForm,
  PriceForm,
  AttachmentsForm,
  ChaptersForm,
} from "./_components/forms";
import CourseActions from "./_components/course-actions";
import { Banner } from "@/components/custom/banner";

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

  const isCompleted = requiredFields.every(Boolean);
  const isChapterPublished = chapters.some((chapter) => chapter.isPublished);

  return (
    <>
      {!course.isPublished && (
        <Banner
          variant={"warning"}
          label="This course is unplubished. It will not be visible to the students."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span>Complete all fields {completionText}</span>
          </div>
          <CourseActions
            courseId={course.id}
            isPublished={course.isPublished}
            disabled={!isCompleted}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16">
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
                {!isChapterPublished && (
                  <p className="text-xs font-medium ml-auto flex items-center gap-2 text-red-500 py-1 rounded-sm px-3 bg-red-50">
                    <UploadIcon className="size-3" />
                    Publish a chapter to publish this course
                  </p>
                )}
                {isCompleted && !course.isPublished && (
                  <p className="text-xs font-medium ml-auto flex items-center gap-2 text-emerald-500 py-1 rounded-sm px-3 bg-emerald-50">
                    <UploadIcon className="size-3" />
                    This course can now be published
                  </p>
                )}
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
    </>
  );
};

export default CourseDetailPage;
