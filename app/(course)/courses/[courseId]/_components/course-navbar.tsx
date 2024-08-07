import React, { FC } from "react";
import MobileSidebar from "./mobile-sidebar";
import NavbarRoutes from "@/components/custom/navbar-routes";
import { HomeIcon, SlashIcon } from "lucide-react";
import Link from "next/link";
import { CourseWithChapters } from "../layout";

interface NavbarProps {
  course: CourseWithChapters;
  progressCount: number;
}

const Navbar: FC<NavbarProps> = ({ course, progressCount }) => {
  return (
    <div className="p-4 border-b h-full w-full flex items-center bg-white shadow-sm">
      <div className="hidden md:flex h-full items-center gap-2 text-gray-400 font-medium">
        <Link href={"/"} className="hover:text-gray-500 transition-colors">
          <HomeIcon className="size-4" />
        </Link>
        <Link
          href={"/search"}
          className="hover:text-gray-500 transition-colors"
        >
          <span className="text-sm">/ Courses /</span>{" "}
        </Link>
        <span className="text-base text-sky-700">{course?.title}</span>
      </div>
      <MobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
