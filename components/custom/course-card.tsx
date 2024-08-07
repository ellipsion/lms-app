import { CourseWithProgressWithCategory } from "@/actions/get-courses";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/formats";
import CourseProgress from "./course-progress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}

const CourseCard: FC<CourseCardProps> = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-sm flex flex-col transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt="title" src={imageUrl} />
        </div>
        <div className="flex-1 flex flex-col pt-2">
          <div className="text-lg md:text-base  font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs font-medium mt-1 mb-3 text-muted-foreground">
            {category}
          </p>
          <div className="mt-auto  my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <div>
              <CourseProgress value={progress} size="sm" />
            </div>
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
