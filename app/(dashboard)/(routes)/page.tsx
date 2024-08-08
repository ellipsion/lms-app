import React from "react";
import { auth, UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from "./search/_components/courses-list";
import InfoCard from "@/components/custom/info-card";
import { CheckCircle2, Clock } from "lucide-react";

const page = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, inProgressCourses } = await getDashboardCourses(
    userId
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div>
          <InfoCard
            value={inProgressCourses.length}
            label="In Progress"
            icon={Clock}
          />
        </div>
        <div>
          <InfoCard
            value={completedCourses.length}
            label="Completed"
            icon={CheckCircle2}
            variant="success"
          />
        </div>
      </div>
      <h1 className="text-2xl font-medium pt-5">My Courses</h1>
      <CoursesList courses={[...inProgressCourses, ...completedCourses]} />
    </div>
  );
};

export default page;
