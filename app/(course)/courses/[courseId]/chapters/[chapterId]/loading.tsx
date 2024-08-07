import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { FC } from "react";

interface ChapterLoadingProps {}

const ChapterLoading: FC<ChapterLoadingProps> = ({}) => {
  return (
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
  );
};

export default ChapterLoading;
