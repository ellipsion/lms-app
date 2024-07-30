"use client";

import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";
import { IconType } from "react-icons/lib";
import qs from "query-string";

interface CategoryItemProps {
  label: string;
  value: string;
  icon?: IconType;
}

const CategoryItem: FC<CategoryItemProps> = ({ label, value, icon: Icon }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("category");
  const currentQuery = searchParams.get("query");

  const isSelected = currentCategoryId === value;

  const handleClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          query: currentQuery,
          category: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
        isSelected && "border-sky-700 bg-sky-200/20 text-slate-800"
      )}
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </button>
  );
};

export default CategoryItem;
