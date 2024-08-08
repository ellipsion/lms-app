import { LucideIcon } from "lucide-react";
import { FC } from "react";
import { IconBadge } from "./icon-badge";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  variant?: "default" | "success";
}

const InfoCard: FC<InfoCardProps> = ({ label, value, variant, icon }) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 px-3 py-5">
      <IconBadge variant={variant} size={"lg"} icon={icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-500 text-sm">
          {value} {value === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
