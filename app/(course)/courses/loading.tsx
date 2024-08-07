import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { FC, ReactNode } from "react";

interface CourseLoadingProps {}

const CourseLoading: FC<CourseLoadingProps> = async () => {
  return (
    <div className="h-full">
      <div className="p-4 h-[80px] fixed inset-x-0 w-full z-50 bg-background border-b">
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
          <Skeleton className="w-1/3 h-5" />
        </div>
      </div>
      <div className="hidden md:flex flex-col h-full mt-[80px] bg-background border-r w-64 fixed inset-y-0 z-50">
        <div className="p-4 flex flex-col gap-5 mt-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      </div>
      <main className="md:pl-64 pt-[80px] min-h-full">
        <div className="w-full">
          <div className="flex flex-col w-full max-w-5xl mx-auto pb-20">
            <div className="p-4">
              <div className="relative aspect-video">
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <Loader2 className="size-8 animate-spin text-secondary" />
                </div>
              </div>
            </div>
            <div className="p-4 w-full">
              <Skeleton className="h-6 w-1/2" />
            </div>
            <Separator />
            <div className="p-4 w-full space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseLoading;
