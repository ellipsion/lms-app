import { FC } from "react";
import SidebarRoutes from "./sidebar-routes";
import { CourseWithChapters } from "../layout";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import SidebarItem from "./course-sidebar-item";

interface CourseSidebarProps {
  course: CourseWithChapters;
  progressCount: number;
}

const CourseSidebar: FC<CourseSidebarProps> = async ({
  course,
  progressCount,
}) => {
  const { userId } = auth();

  if (!userId || !course) {
    return redirect("/");
  }

  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <SidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
