import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await prisma.course.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="text-3xl font-medium">Your courses</h1>
      <header className="flex items-center justify-between mt-10 mb-5">
        <Link href={"/teacher/create"}>
          <Button>New Course</Button>
        </Link>
      </header>
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
