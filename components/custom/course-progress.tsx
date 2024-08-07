import { FC } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const sizeMap = {
  default: "h-3",
  sm: "h-2",
};

const textColorMap = {
  success: "text-emerald-500",
  default: "text-sky-600",
};

interface CourseProgressProps {
  value: number;
  variant?: "success" | "default";
  size?: "default" | "sm";
}

const CourseProgress: FC<CourseProgressProps> = ({ value, variant, size }) => {
  return (
    <div>
      <Progress
        value={value}
        variant={variant}
        className={cn(sizeMap[size || "default"])}
      />
      <p
        className={cn(
          "text-xs font-semibold text-muted-foreground mt-1",
          textColorMap[variant || "default"]
        )}
      >
        {Math.round(value)}% completed
      </p>
    </div>
  );
};

export default CourseProgress;
