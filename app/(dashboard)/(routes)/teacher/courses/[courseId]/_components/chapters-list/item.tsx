"use client";

import React, { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Chapter } from "@prisma/client";
import { cn } from "@/lib/utils";
import { GripVerticalIcon, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SortableItemProps {
  id: string;
  chapter: Chapter;
  onEdit: (id: string) => void;
}

export const SortableItem: FC<SortableItemProps> = ({
  id,
  chapter,
  onEdit,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
          chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
        )}
      >
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition"
          )}
        >
          <GripVerticalIcon className="w-4 h-4 stroke-slate-500" />
        </div>
        {chapter.title}
        <div className="flex items-center ml-auto gap-x-3">
          {chapter.isFree && <Badge>free</Badge>}
          {chapter.isPublished ? (
            <Badge className="bg-sky-700">published</Badge>
          ) : (
            <Badge className="bg-slate-400">draft</Badge>
          )}
          <Button
            onClick={() => onEdit(chapter.id)}
            variant={"ghost"}
            size={"icon"}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
