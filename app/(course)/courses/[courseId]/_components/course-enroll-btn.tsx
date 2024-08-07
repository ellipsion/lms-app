"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formats";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

const CourseEnrollButton: FC<CourseEnrollButtonProps> = ({
  price,
  courseId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleEnroll = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/courses/${courseId}/checkout`);
      window.location.assign(res.data.url);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      disabled={isLoading}
      onClick={handleEnroll}
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};

export default CourseEnrollButton;
