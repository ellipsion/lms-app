import React, { FC } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import { IconBadge } from "@/components/custom/icon-badge";

const SearchPage: FC = async () => {
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <Skeleton className="w-full h-5" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
          {new Array(5).fill(0).map((_) => (
            <button
              key={"category-skeleton" + _}
              type="button"
              className="px-3 py-2 text-sm border border-slate-200 rounded-full flex items-center gap-x-2 hover:border-sky-700 transition"
            >
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="w-20 h-4" />
            </button>
          ))}
        </div>
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {new Array(4).fill(0).map((_) => (
            <div
              key={"course-card-skeleton" + _}
              className="group hover:shadow-sm flex flex-col transition overflow-hidden border rounded-lg p-3 h-full"
            >
              <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="flex-1 flex flex-col gap-2 pt-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-24 mb-3" />
                <div className="mt-auto  my-3 flex items-center gap-x-2 text-sm md:text-xs">
                  <div className="flex items-center gap-x-1 text-slate-500">
                    <IconBadge size={"sm"} icon={BookOpen} />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
