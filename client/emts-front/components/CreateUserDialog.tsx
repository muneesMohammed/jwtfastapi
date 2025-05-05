'use client';

import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Zod schema
const formSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  password: z.string().min(6),
  role_id: z.string(),
});

// Type inference from schema
type FormData = z.infer<typeof formSchema>;

type Role = {
  id: string | number;
  name: string;
};

export default function CreateUserDialog({
  open, onOpenChange, onUserAdded
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [roles, setRoles] = useState<Role[]>([]);

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/roles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRoles(res.data);
    } catch (err) {
      toast.error('Failed to fetch roles');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You are not logged in");
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User created successfully!");
      onOpenChange(false);
      reset();
      onUserAdded();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        toast.error("Unauthorized: Please login again.");
      } else {
        toast.error(error.response?.data?.detail || "Failed to create user.");
      }
    } else {
      toast.error("Unexpected error occurred.");
    }
    console.error("Create user error:", error);
  }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Create a new user and assign a role.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input {...register('email')} />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <Label>Full Name</Label>
            <Input {...register('full_name')} />
            {errors.full_name && <p className="text-sm text-red-600">{errors.full_name.message}</p>}
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <div>
            <Label>Role</Label>
            <Select onValueChange={(value) => setValue('role_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role_id && <p className="text-sm text-red-600">{errors.role_id.message}</p>}
          </div>
          <Button type="submit" className="w-full">Create User</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
