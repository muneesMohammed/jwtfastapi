// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from '@/components/ui/table';
// import { toast } from 'sonner';
// import Spinner from '@/components/spinner';
// import ProtectedRoute from '@/components/ProtectedRoute';
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/ui/alert-dialog";

// interface DailyReport {
//   id: number;
//   date: string;
//   project_id: number;
//   created_at: string;
// }

// export default function DailyReportListPage() {
//   const [reports, setReports] = useState<DailyReport[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [dateFilter, setDateFilter] = useState('');
//   const [projectFilter, setProjectFilter] = useState('');
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [deleteId, setDeleteId] = useState<number | null>(null);

//   const router = useRouter();

//   const fetchReports = useCallback(async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     const params = new URLSearchParams({
//       page: page.toString(),
//       limit: limit.toString(),
//     });
//     if (dateFilter) params.append('date', dateFilter);
//     if (projectFilter) params.append('project_id', projectFilter);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/v1/daily-report/all?${params}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       if (!res.ok) throw new Error('Failed to fetch');

//       const data = await res.json();
//       setReports(data.data || []);
//     } catch {
//       toast.error('Failed to load reports');
//     } finally {
//       setLoading(false);
//     }
//   }, [page, limit, dateFilter, projectFilter]);

//   const handleEdit = (id: number) => {
//     router.push(`/foreman/daily-report/edit/${id}`);
//   };

//   useEffect(() => {
//     fetchReports();
//   }, [fetchReports]);

//   return (
//     <ProtectedRoute>
//       <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-semibold">Daily Reports</h2>
//         </div>

//         <Card>
//           <CardContent className="p-4 space-y-4">
//             {/* Filters */}
//             <div className="flex flex-col md:flex-row gap-4">
//               <Input
//                 type="date"
//                 value={dateFilter}
//                 onChange={e => setDateFilter(e.target.value)}
//                 placeholder="Filter by Date"
//               />
//               <Input
//                 type="text"
//                 value={projectFilter}
//                 onChange={e => setProjectFilter(e.target.value)}
//                 placeholder="Filter by Project ID"
//               />
//               <Button onClick={fetchReports}>Apply Filters</Button>
//             </div>

//             {/* Content */}
//             {loading ? (
//               <div className="flex justify-center py-10">
//                 <Spinner className="h-6 w-6" />
//               </div>
//             ) : reports.length === 0 ? (
//               <p className="text-muted-foreground text-center">No reports found.</p>
//             ) : (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>ID</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Project</TableHead>
//                     <TableHead>Created At</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {reports.map(report => (
//                     <TableRow key={report.id}>
//                       <TableCell>{report.id}</TableCell>
//                       <TableCell>{report.date}</TableCell>
//                       <TableCell>{report.project_id}</TableCell>
//                       <TableCell>{new Date(report.created_at).toLocaleString()}</TableCell>
//                       <TableCell className="text-right space-x-2">
//                         <Button size="sm" variant="outline" onClick={() => handleEdit(report.id)}>
//                           Edit
//                         </Button>
//                         <Button size="sm" variant="destructive" onClick={() => setDeleteId(report.id)}>
//                           Delete
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}

//             {/* Pagination */}
//             <div className="flex justify-end gap-2 pt-4">
//               <Button
//                 variant="outline"
//                 onClick={() => setPage(p => Math.max(1, p - 1))}
//                 disabled={page === 1}
//               >
//                 Previous
//               </Button>
//               <Button variant="outline" onClick={() => setPage(p => p + 1)}>
//                 Next
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Delete Confirmation Dialog */}
//         <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This action cannot be undone. This will permanently delete this report.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={async () => {
//                   if (deleteId !== null) {
//                     const token = localStorage.getItem('token');
//                     try {
//                       const res = await fetch(
//                         `${process.env.NEXT_PUBLIC_API_URL}/api/v1/daily-report/${deleteId}`,
//                         {
//                           method: 'DELETE',
//                           headers: {
//                             Authorization: `Bearer ${token}`,
//                           },
//                         },
//                       );

//                       if (!res.ok) throw new Error('Delete failed');

//                       toast.success('Deleted report');
//                       fetchReports();
//                     } catch {
//                       toast.error('Failed to delete');
//                     } finally {
//                       setDeleteId(null); // Close dialog
//                     }
//                   }
//                 }}
//               >
//                 Delete
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     </ProtectedRoute>
//   );
// }
