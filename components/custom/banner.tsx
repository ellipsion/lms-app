import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangleIcon, CheckCircleIcon, LucideIcon } from "lucide-react";
import { FC } from "react";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success: "bg-emerald-700 border-emerald-800 text-secondary",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

const iconMap: Record<string, LucideIcon> = {
  warning: AlertTriangleIcon,
  success: CheckCircleIcon,
};

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

export const Banner: FC<BannerProps> = ({ label, variant }) => {
  const Icon = iconMap[variant || "warning"];
  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="size-4 mr-2" />
      {label}
    </div>
  );
};
