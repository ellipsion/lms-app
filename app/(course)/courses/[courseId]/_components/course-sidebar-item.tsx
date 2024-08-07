"use client";

import { cn } from "@/lib/utils";
import { Chapter, Purchase, UserProgress } from "@prisma/client";
import {
  CheckSquare,
  LockIcon,
  LucideIcon,
  PlayIcon,
  PlaySquareIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface sidebarItemProps {
  id: string;
  courseId: string;
  label: string;
  isCompleted: boolean;
  isLocked: boolean;
}

const SidebarItem = ({
  id,
  label,
  isCompleted,
  courseId,
  isLocked,
}: sidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname?.includes(id);
  const changeRoute = () => router.push(`/courses/${courseId}/chapters/${id}`);

  const Icon = isLocked
    ? LockIcon
    : isActive
    ? PlayIcon
    : isCompleted
    ? CheckSquare
    : PlaySquareIcon;

  return (
    <button
      type="button"
      onClick={changeRoute}
      className={cn(
        "group flex items-center text-sm font-medium text-center gap-x-2 text-slate-500 pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-slate-700 hover:text-sky-700 bg-slate-200/20 hover:bg-sky-200/20"
      )}
    >
      <div className="flex items-center py-4 gap-2">
        <Icon
          size={18}
          className={cn(
            "text-slate-500 ",
            isActive && "text-slate-700 group-hover:stroke-sky-700",
            isActive && isCompleted && "text-emerald-500"
          )}
        />
        <span className="text-ellipsis overflow-hidden max-w-48 text-nowrap">
          {label}
        </span>
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full",
          isActive && "opacity-100"
        )}
      ></div>
    </button>
  );
};

export default SidebarItem;
