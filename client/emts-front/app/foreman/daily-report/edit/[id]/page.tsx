'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EditDailyReportForm from '@/components/EditDailyReportForm';
import Spinner from '@/components/spinner';
import { toast } from 'sonner';

interface DailyReport {
  id: number;
  date: string;
  project_id: number;
  created_at: string;
  // Add any other fields your form needs
}

export default function EditDailyReportPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized: No token found');
        router.push('/login'); // Or redirect somewhere
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/daily-report/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch report');

        const data = await res.json();
        setReport(data);
      } catch (err) {
        toast.error('Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (!report) {
    return <div className="text-center py-10 text-muted-foreground">Report not found or failed to load.</div>;
  }

  return <EditDailyReportForm initialData={report} />;
}
