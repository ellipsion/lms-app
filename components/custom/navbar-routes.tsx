"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";
import { Skeleton } from "../ui/skeleton";

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.startsWith("/courses");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href={"/"}>
            <Button size={"sm"} variant={"ghost"}>
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href={"/teacher/courses"}>
            <Button variant={"ghost"} size={"sm"}>
              Teacher Mode
            </Button>
          </Link>
        )}

        <div className="relative size-9 flex items-center justify-center">
          <Skeleton className="absolute size-9 rounded-full" />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </>
  );
};

export default NavbarRoutes;
