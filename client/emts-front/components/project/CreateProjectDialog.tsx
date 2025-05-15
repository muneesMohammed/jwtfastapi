'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// Define types
interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  role: { name: string };
}

export default function CreateProjectDialog({
  open,
  onOpenChange,
  onProjectAdded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectAdded: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    status: 'planning',
    foreman_id: null as number | null,
    engineer_id: null as number | null,
    project_manager_id: null as number | null,
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  // const [loading, setLoading] = useState(true);

  // Load employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setEmployees(data);
      } catch {
        toast.error('Failed to load employees');
      }
    };

    if (open) {
      fetchEmployees();
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle numeric fields only
    const numericFields = ['foreman_id', 'engineer_id', 'project_manager_id'];

    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) 
        ? (value === '' ? null : parseInt(value)) 
        : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success('✅ Project created successfully');
      onProjectAdded();
      onOpenChange(false);
      setFormData({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        status: 'planning',
        foreman_id: null,
        engineer_id: null,
        project_manager_id: null,
      });
    } catch {
      toast.error('❌ Failed to create project');
    }
  };

  // Filter employees by role
  const foremen = employees.filter((e) => e.role.name === 'foreman');
  const engineers = employees.filter((e) => e.role.name === 'engineer');
  const projectManagers = employees.filter(
    (e) => e.role.name === 'project_manager'
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Fill in the details below</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Project Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Status</Label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Foreman Dropdown */}
          <div>
            <Label>Foreman</Label>
            <select
              name="foreman_id"
              value={formData.foreman_id ?? ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">-- Select Foreman --</option>
              {foremen.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Engineer Dropdown */}
          <div>
            <Label>Engineer</Label>
            <select
              name="engineer_id"
              value={formData.engineer_id ?? ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">-- Select Engineer --</option>
              {engineers.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Project Manager Dropdown */}
          <div>
            <Label>Project Manager</Label>
            <select
              name="project_manager_id"
              value={formData.project_manager_id ?? ''}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">-- Select Project Manager --</option>
              {projectManagers.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}