import { AlertTriangleIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProjectNotFound() {
  return (
    <div className="h-full flex items-center justify-center">
      <Card className="max-w-105">
        <CardContent className="flex items-center gap-2">
          <AlertTriangleIcon />
          <p>Project Not Found</p>
        </CardContent>
      </Card>
    </div>
  );
}
