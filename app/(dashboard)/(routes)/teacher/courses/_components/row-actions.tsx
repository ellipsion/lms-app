import { FC } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

interface RowActionsProps {
  courseId: string;
}

const RowActions: FC<RowActionsProps> = ({ courseId }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/teacher/courses/${courseId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="size-6">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActions;
