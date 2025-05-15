// components/employee/EmployeesPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, PlusCircle, Pencil } from "lucide-react";
import { toast } from 'sonner';
import CreateEmployeeDialog from "./CreateEmployeeDialog";
import EditEmployeeDialog from "@/components/employee/EditEmployeeDialog";

interface Role {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  hire_date: string | null;
  salary: number | null;
  role: Role;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByRole, setFilterByRole] = useState<string>("");

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast.error("🚨 Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("✅ Employee deleted successfully");
      fetchEmployees();
    } catch (error: any) {
      const message = error.response?.data?.detail || "Failed to delete employee";
      toast.error(`❌ ${message}`);
    }
  };

  const openEditDialogFor = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenEditDialog(true);
  };

  const refreshList = () => {
    fetchEmployees();
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter by search term and role
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterByRole ? emp.role.name === filterByRole : true;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading employees...</p>
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-lg p-4">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Employee Management</CardTitle>
          <Button onClick={() => setOpenCreateDialog(true)} className="gap-2">
            <PlusCircle size={16} /> Add Employee
          </Button>
        </CardHeader>

        <CardContent>
          {/* Search & Filter */}
          <div className="mb-4 flex gap-4 flex-wrap">
            <Input
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
            <select
              value={filterByRole}
              onChange={(e) => setFilterByRole(e.target.value)}
              className="border rounded-md px-3 py-2 bg-white dark:bg-black"
            >
              <option value="">All Roles</option>
              <option value="foreman">Foreman</option>
              <option value="engineer">Engineer</option>
              <option value="project_manager">Project Manager</option>
              <option value="worker">Worker</option>
            </select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>{`${emp.first_name} ${emp.last_name}`}</TableCell>
                    <TableCell>{emp.email || "-"}</TableCell>
                    <TableCell>{emp.phone || "-"}</TableCell>
                    <TableCell>{emp.role?.name || "No role"}</TableCell>
                    <TableCell>{emp.hire_date || "-"}</TableCell>
                    <TableCell>{emp.salary ? `$${emp.salary}` : "-"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialogFor(emp)}>
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteEmployee(emp.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No employees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateEmployeeDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onEmployeeAdded={refreshList}
      />

      {selectedEmployee && (
        <EditEmployeeDialog
          open={openEditDialog}
          onOpenChange={setOpenEditDialog}
          employee={selectedEmployee}
          onEmployeeUpdated={refreshList}
        />
      )}
    </>
  );
}