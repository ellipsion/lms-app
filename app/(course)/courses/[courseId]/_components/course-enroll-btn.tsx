"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formats";
import { FC } from "react";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

const CourseEnrollButton: FC<CourseEnrollButtonProps> = ({
  price,
  courseId,
}) => {
  return (
    <Button className="w-full md:w-auto">
      Enroll for {formatPrice(price)}
    </Button>
  );
};

export default CourseEnrollButton;
