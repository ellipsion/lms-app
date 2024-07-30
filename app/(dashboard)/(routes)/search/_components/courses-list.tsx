import { CourseWithProgressWithCategory } from "@/actions/get-courses";
import { Course } from "@prisma/client";
import { FC } from "react";
import CourseCard from "@/components/custom/course-card";

interface CoursesListProps {
  courses: CourseWithProgressWithCategory[];
}

const CoursesList: FC<CoursesListProps> = ({ courses }) => {
  return (
    <div>
      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            price={course.price!}
            chaptersLength={course.chapters.length}
            category={course.category?.name!}
            imageUrl={course.imageUrl!}
            progress={course.progress}
          />
        ))}
      </div>
      {courses.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-20">
          No courses found
        </div>
      )}
    </div>
  );
};

export default CoursesList;
