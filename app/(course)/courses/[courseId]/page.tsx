import { FC } from "react";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

interface CourseDetailPageProps {
  params: { courseId: string };
}

const CourseDetailPage: FC<CourseDetailPageProps> = async ({ params }) => {
  const { courseId } = params;

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course || course.chapters.length === 0) {
    return redirect("/");
  }

  const firstChapter = course.chapters?.[0];

  return redirect(`/courses/${courseId}/chapters/${firstChapter.id}`);
};

export default CourseDetailPage;
