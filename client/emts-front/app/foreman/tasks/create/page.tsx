// File: app/foreman/tasks/create/page.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function CreateTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = () => {
    console.log({ title, description, deadline });
    // You can trigger your API here to save the task
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Assign New Task</h1>

      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="deadline">Deadline</Label>
        <Input type="date" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </div>

      <Button onClick={handleSubmit}>Create Task</Button>
    </div>
  );
}
