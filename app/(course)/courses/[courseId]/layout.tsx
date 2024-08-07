import { TLayoutProps } from "@/lib/typings";
import React, { FC, ReactNode } from "react";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getProgress } from "@/actions/get-progress";
import Navbar from "./_components/course-navbar";
import CourseSidebar from "./_components/course-sidebar";
import { Chapter, Course, UserProgress } from "@prisma/client";

export type CourseWithChapters = Course & {
  chapters: (Chapter & { userProgress: UserProgress[] | null })[];
};

interface CourseLayoutProps {
  children: ReactNode[];
  params: { courseId: string };
}

const CourseLayout: FC<CourseLayoutProps> = async ({ children, params }) => {
  const { userId } = auth();
  const { courseId } = params;

  if (!userId) {
    return redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const progress = await getProgress(userId, courseId);

  return (
    <div className="h-full">
      <div className="h-[80px] fixed inset-x-0 w-full z-50">
        <Navbar course={course} progressCount={progress} />
      </div>
      <div className="hidden md:flex flex-col h-full mt-[80px] bg-gray-50 w-64 fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progress} />
      </div>
      <main className="md:pl-64 pt-[80px] min-h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;
