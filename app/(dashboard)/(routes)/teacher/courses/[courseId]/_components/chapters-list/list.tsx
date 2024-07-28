"use client";

import { Chapter } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./item";

interface ChaptersListProps {
  items: Chapter[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

export const ChaptersList: FC<ChaptersListProps> = ({
  items,
  onEdit,
  onReorder,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldItem = chapters.find((item) => item.id === active.id);
      const newItem = chapters.find((item) => item.id === over.id);
      const oldIndex = oldItem ? chapters.indexOf(oldItem) : -1;
      const newIndex = newItem ? chapters.indexOf(newItem) : -1;

      const newArray = arrayMove(chapters, oldIndex, newIndex);
      setChapters(newArray);
      const bulkUpdateData = newArray.map((item, index) => ({
        id: item.id,
        position: index,
      }));
      onReorder(bulkUpdateData);
    }
  }

  if (!isMounted) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={chapters} strategy={verticalListSortingStrategy}>
        {chapters.map((chapter) => (
          <SortableItem
            key={chapter.id}
            id={chapter.id}
            onEdit={onEdit}
            chapter={chapter}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};
