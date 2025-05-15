// components/project/ProjectsPage.tsx

'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import CreateProjectDialog from './CreateProjectDialog';
import EditProjectDialog from './EditProjectDialog';
import { Project } from '@/types/project';



export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('');

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('🚨 Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('✅ Project deleted successfully');
      fetchProjects();
    } catch (error: unknown) {
      let message = 'Failed to delete project';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail || message;
      }
      toast.error(`❌ ${message}`);
    }
  };

  const openEditDialogFor = (project: Project) => {
    setSelectedProject(project);
    setOpenEditDialog(true);
  };

  const refreshList = () => {
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter by search term and status
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (proj.location && proj.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterByStatus ? proj.status === filterByStatus : true;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-lg p-4">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Project Management</CardTitle>
          <Button onClick={() => setOpenCreateDialog(true)} className="gap-2">
            <PlusCircle size={16} /> Add Project
          </Button>
        </CardHeader>

        <CardContent>
          {/* Search & Filter */}
          <div className="mb-4 flex gap-4 flex-wrap">
            <Input
              placeholder="Search by name or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
            <select
              value={filterByStatus}
              onChange={(e) => setFilterByStatus(e.target.value)}
              className="border rounded-md px-3 py-2 bg-white dark:bg-black"
            >
              <option value="">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((proj) => (
                  <TableRow key={proj.id}>
                    <TableCell>{proj.name}</TableCell>
                    <TableCell>{proj.description || '-'}</TableCell>
                    <TableCell>{proj.start_date || '-'}</TableCell>
                    <TableCell>{proj.end_date || '-'}</TableCell>
                    <TableCell>{proj.status}</TableCell>
                    <TableCell>{proj.location || '-'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialogFor(proj)}>
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteProject(proj.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No projects found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateProjectDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        onProjectAdded={refreshList}
      />

      {selectedProject && (
        <EditProjectDialog
          open={openEditDialog}
          onOpenChange={setOpenEditDialog}
          project={selectedProject}
          onProjectUpdated={refreshList}
        />
      )}
    </>
  );
}