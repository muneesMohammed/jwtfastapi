// File: app/foreman/workers/[workerId]/page.tsx

import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  params: {
    workerId: string;
  };
}

// Simulate fetching worker data
const getWorker = (id: string) => {
  const workers = {
    "1": { name: "John Doe", status: "Active", tasksAssigned: 3 },
    "2": { name: "Jane Smith", status: "On Leave", tasksAssigned: 1 },
  };
  return workers[id] || null;
};

export default function WorkerProfilePage({ params }: Props) {
  const worker = getWorker(params.workerId);
  if (!worker) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Worker Profile</h1>
      <Card className="max-w-md">
        <CardHeader className="text-xl font-semibold">{worker.name}</CardHeader>
        <CardContent className="space-y-2">
          <p>Status: <Badge>{worker.status}</Badge></p>
          <p>Tasks Assigned: {worker.tasksAssigned}</p>
          <Button variant="outline" size="sm">Assign New Task</Button>
        </CardContent>
      </Card>
    </div>
  );
}
