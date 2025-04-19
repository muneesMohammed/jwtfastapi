// File: app/foreman/tasks/[taskId]/page.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: {
    taskId: string;
  };
}

// Simulated task data
const getTask = (id: string) => {
  const tasks = {
    "101": {
      title: "Pour Concrete Slab",
      description: "Complete pouring of 20m³ of concrete.",
      status: "In Progress",
      deadline: "2025-04-10",
      assignedTo: "John Doe"
    }
  };
  return tasks[id] || null;
};

export default function TaskDetailPage({ params }: Props) {
  const task = getTask(params.taskId);
  if (!task) return <div className="p-6">Task not found</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <div className="space-y-2">
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Status:</strong> <Badge>{task.status}</Badge></p>
        <p><strong>Deadline:</strong> {task.deadline}</p>
        <p><strong>Assigned to:</strong> {task.assignedTo}</p>
        <Button variant="outline">Mark as Complete</Button>
      </div>
    </div>
  );
}
