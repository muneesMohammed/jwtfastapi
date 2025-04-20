'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ReportData {
  id: string;
  manpower: string;
  machinery: string;
  activities: string;
}

interface EditFormProps {
  initialData: ReportData;
}

const EditDailyReportForm = ({ initialData }: EditFormProps) => {
  const router = useRouter();

  const [manpower, setManpower] = useState(initialData.manpower);
  const [machinery, setMachinery] = useState(initialData.machinery);
  const [activities, setActivities] = useState(initialData.activities);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      toast.error('Unauthorized. Please login again.');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/daily-report/${initialData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        manpower,
        machinery,
        activities,
      }),
    });

    if (res.ok) {
      toast.success('Report updated successfully!');
      router.push('/foreman/daily-report');
    } else {
      toast.error('Failed to update report');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto mt-8">
      <Input
        placeholder="Manpower Utilized"
        value={manpower}
        onChange={(e) => setManpower(e.target.value)}
      />
      <Input
        placeholder="Machinery Utilized"
        value={machinery}
        onChange={(e) => setMachinery(e.target.value)}
      />
      <Input
        placeholder="Activities Carried Out"
        value={activities}
        onChange={(e) => setActivities(e.target.value)}
      />
      <Button type="submit" className="w-full">
        Update Report
      </Button>
    </form>
  );
};

export default EditDailyReportForm;
