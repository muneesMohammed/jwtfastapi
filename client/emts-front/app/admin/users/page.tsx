'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';
import CreateUserDialog from '@/components/CreateUserDialog';

// interface Role {
//   id: number;
//   name: string;
// }
interface User {
  id: number;
  email: string;
  full_name: string;
  role: {
    id: number;
    name: string;
    permissions?: string | null;
  };
}



export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const fetchUsers = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // accessToken must be valid
      },
    }); // your backend endpoint
    setUsers(res.data);
  };
 
  const deleteUser = async (id: number) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // accessToken must be valid
      },
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card className="p-4 shadow-lg">
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <PlusCircle size={16} /> Add User
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.role?.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="sm" onClick={() => deleteUser(user.id)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CreateUserDialog open={open} onOpenChange={setOpen} onUserAdded={fetchUsers} />
    </Card>
  );
}
