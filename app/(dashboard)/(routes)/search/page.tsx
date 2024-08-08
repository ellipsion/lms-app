import React, { FC } from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getCourses } from "@/actions/get-courses";
import SearchInput from "@/components/custom/search-input";

import Categories from "./_components/categories";
import CoursesList from "./_components/courses-list";

interface PageProps {
  searchParams: { query: string; category: string };
}

const SearchPage: FC<PageProps> = async ({ searchParams }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({
    userId,
    title: searchParams.query,
    categoryId: searchParams.category,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>

      <div className="p-6">
        <Categories items={categories} />
        <h1 className="text-2xl font-medium pt-5">Browse Courses</h1>
        <CoursesList courses={courses} />
      </div>
    </>
  );
};

export default SearchPage;
