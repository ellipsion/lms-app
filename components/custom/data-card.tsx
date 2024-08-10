import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/formats";

interface DataCardProps {
  value: number;
  label: string;
  format?: boolean;
}

const DataCard: FC<DataCardProps> = ({ value, label, format }) => {
  return (
    <Card>
      <CardHeader className="flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {format ? formatPrice(value) : value}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCard;
