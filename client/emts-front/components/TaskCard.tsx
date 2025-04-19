'use client';

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  id: string;
  title: string;
  status: "Not Started" | "In Progress" | "Completed";
  deadline: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ id, title, status, deadline }) => {
  const router = useRouter();

  const handleView = () => {
    router.push(`/foreman/tasks/${id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="text-lg font-semibold">{title}</CardHeader>
      <CardContent className="flex justify-between items-center">
        <Badge variant="outline">{status}</Badge>
        <span className="text-sm text-muted-foreground">Due: {deadline}</span>
        <Button onClick={handleView} variant="outline" size="sm">View</Button>
      </CardContent>
    </Card>
  );
};
