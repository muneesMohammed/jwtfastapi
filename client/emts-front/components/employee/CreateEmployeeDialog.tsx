"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import schema
import { EmployeeSchema } from "@/lib/schema/employeeSchema";

type FormData = z.infer<typeof EmployeeSchema>;
type RoleOption = {
  id: number;
  name: string;
};

export default function CreateEmployeeDialog({
  open,
  onOpenChange,
  onEmployeeAdded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeAdded: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<RoleOption[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      hire_date: "",
      salary: undefined,
      role_id: undefined,
    },
  });

  // Fetch roles on dialog open
  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open]);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(res.data);
    } catch (err) {
      console.error("Failed to fetch roles", err);
      toast.error("🚨 Failed to load roles.");
    }
  };

  const onSubmit = async (values: FormData) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("🚨 You are not logged in.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/employees`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("✅ Employee created successfully!");
      onOpenChange(false);
      form.reset();
      onEmployeeAdded();
    } catch (error: unknown) {
  let message = "Failed to create employee.";

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as { response?: { data?: { detail?: string } } };
    message = axiosError.response?.data?.detail || message;
  }

  toast.error(`❌ ${message}`);
}
     finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>Create a new employee and assign a role.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div>
            <Label>First Name</Label>
            <Input {...form.register("first_name")} placeholder="John" />
            {form.formState.errors.first_name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.first_name.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label>Last Name</Label>
            <Input {...form.register("last_name")} placeholder="Doe" />
            {form.formState.errors.last_name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.last_name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input {...form.register("email")} placeholder="john.doe@example.com" />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <Input {...form.register("phone")} placeholder="+1234567890" />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.phone?.message}
              </p>
            )}
          </div>

          {/* Hire Date */}
          <div>
            <Label>Hire Date</Label>
            <Input
              type="date"
              value={form.watch("hire_date") || ""}
              onChange={(e) =>
                form.setValue("hire_date", e.target.value)
              }
            />
            {form.formState.errors.hire_date && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.hire_date.message}
              </p>
            )}
          </div>

          {/* Salary */}
          <div>
            <Label>Salary</Label>
            <Input
              type="number"
              value={form.watch("salary") ?? ""}
              onChange={(e) =>
                form.setValue(
                  "salary",
                  e.target.value === "" ? undefined : parseInt(e.target.value)
                )
              }
              placeholder="50000"
            />
            {form.formState.errors.salary && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.salary.message}
              </p>
            )}
          </div>

          {/* Role Dropdown */}
          <div>
            <Label>Role</Label>
            <Select
              onValueChange={(value) => form.setValue("role_id", Number(value))}
              value={form.watch("role_id")?.toString() || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))
                ) : (
                  <p className="p-2 text-sm text-muted-foreground">No roles found</p>
                )}
              </SelectContent>
            </Select>
            {form.formState.errors.role_id && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.role_id.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                </svg>
                Creating...
              </>
            ) : (
              "Create Employee"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}