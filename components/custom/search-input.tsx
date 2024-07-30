"use client";

import { SearchIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import Categories from "@/app/(dashboard)/(routes)/search/_components/categories";

interface SearchInputProps {}

const SearchInput: FC<SearchInputProps> = ({}) => {
  const [value, setValue] = useState<string>();
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("category");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          category: currentCategoryId,
          query: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="relative">
      <SearchIcon className="size-4 absolute top-3 left-3 text-slate-600" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search course..."
      />
    </div>
  );
};

export default SearchInput;
