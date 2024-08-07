import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./course-sidebar";
import CourseSidebar from "./course-sidebar";
import { CourseWithChapters } from "../layout";
import { FC } from "react";

interface ChapterMobileSidebarProps {
  course: CourseWithChapters;
  progressCount: number;
}

const MobileSidebar: FC<ChapterMobileSidebarProps> = ({
  course,
  progressCount,
}) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white">
        <div className="p-6 text-sm font-medium">{course?.title}</div>
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
