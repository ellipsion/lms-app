"use client";

import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import RowActions from "./row-actions";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "isPublished",
    header: "Published",
  },
  {
    id: "actions",
    header: "...",
    cell: ({ row }) => (
      <RowActions key={row.original.id} courseId={row.original.id} />
    ),
  },
];
