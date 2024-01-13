import React from "react";

interface PageProps {
  params: {
    courseId: string;
  };
}

const CourseDetailPage = ({ params }: PageProps) => {
  const { courseId } = params;
  return (
    <div>
      <h1>Course ID: {courseId}</h1>
    </div>
  );
};

export default CourseDetailPage;
