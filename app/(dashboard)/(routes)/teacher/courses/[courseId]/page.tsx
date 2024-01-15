import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs";

import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

import TitleForm from "./_components/title-form";

import { IconBadge } from "@/components/custom/icon-badge";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";

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
  });

  if (!course) {
    return redirect("/");
  }

  const { title, description, price, imageUrl, categoryId } = course;

  const requiredFields = [title, description, price, imageUrl, categoryId];
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
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
