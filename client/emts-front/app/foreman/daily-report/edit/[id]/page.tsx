'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Spinner from '@/components/spinner';

interface ApiManpower {
  worker_id: string;
  name: string;
  category: string;
  skilled: boolean;
  total_hours: number;
}

interface ApiMachinery {
  machinery_name: string;
  hours_used: number;
  remarks: string;
}

interface ApiActivity {
  activity_name: string;
  unit: string;
  quantity: string;
  remarks: string;
}

interface DailyReportResponse {
  manpower: ApiManpower[];
  machinery: ApiMachinery[];
  activities: ApiActivity[];
}

interface ManpowerEntry {
  id: string;
  name: string;
  category: string;
  skilled: boolean;
  hours: string;
}

interface MachineryEntry {
  name: string;
  hours: string;
  remarks: string;
}

interface ActivityEntry {
  description: string;
  unit: string;
  quantity: string;
  remarks: string;
}

export default function EditDailyReportPage() {
  const [manpower, setManpower] = useState<ManpowerEntry[]>([]);
  const [machinery, setMachinery] = useState<MachineryEntry[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('No authentication token found. Please log in again.');
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/daily-report/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.detail || 'Failed to fetch report');
        }

        const data: DailyReportResponse = result.data;

        setManpower((data.manpower ?? []).map(mp => ({
          id: mp.worker_id,
          name: mp.name,
          category: mp.category,
          skilled: mp.skilled,
          hours: mp.total_hours.toString(),
        })));

        setMachinery((data.machinery ?? []).map(m => ({
          name: m.machinery_name,
          hours: m.hours_used.toString(),
          remarks: m.remarks,
        })));

        setActivities((data.activities ?? []).map(a => ({
          description: a.activity_name,
          unit: a.unit,
          quantity: a.quantity,
          remarks: a.remarks,
        })));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`❌ Error fetching report: ${error.message}`);
        } else {
          toast.error('❌ Error fetching report.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [id, router]);

  const handleManpowerChange = <K extends keyof ManpowerEntry>(index: number, field: K, value: ManpowerEntry[K]) => {
    const updated = [...manpower];
    updated[index][field] = value;
    setManpower(updated);
  };
  

  const handleMachineryChange = <K extends keyof MachineryEntry>(index: number, field: K, value: MachineryEntry[K]) => {
    const updated = [...machinery];
    updated[index][field] = value;
    setMachinery(updated);
  };
  

  const handleActivityChange = <K extends keyof ActivityEntry>(index: number, field: K, value: ActivityEntry[K]) => {
    const updated = [...activities];
    updated[index][field] = value;
    setActivities(updated);
  };
  
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please login again.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      date: new Date().toISOString().split('T')[0],
      project_id: 1,
      manpower: manpower.map(mp => ({
        worker_id: mp.id,
        name: mp.name,
        category: mp.category,
        total_hours: Number(mp.hours),
        skilled: mp.skilled,
      })),
      machinery: machinery.map(m => ({
        machinery_name: m.name,
        hours_used: Number(m.hours),
        remarks: m.remarks,
      })),
      activities: activities.map(a => ({
        activity_name: a.description,
        unit: a.unit,
        quantity: a.quantity,
        remarks: a.remarks,
      })),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/daily-report/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('✅ Report updated successfully!');
        setTimeout(() => router.push('/foreman/daily-report-list'), 1500);
      } else {
        toast.error(`❌ ${result.detail || 'Something went wrong while updating.'}`);
      }
    } catch {
      toast.error('🚨 Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h2 className="text-2xl font-bold">Edit Daily Gang Productivity Report</h2>

      {/* Manpower Section */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Manpower Utilized</h3>
        {manpower.map((mp, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 mb-2 items-center">
            <Input value={mp.id} onChange={e => handleManpowerChange(index, 'id', e.target.value)} placeholder="ID" />
            <Input value={mp.name} onChange={e => handleManpowerChange(index, 'name', e.target.value)} placeholder="Name" />
            <Input value={mp.category} onChange={e => handleManpowerChange(index, 'category', e.target.value)} placeholder="Category" />
            <div className="flex items-center space-x-2">
              <Checkbox checked={mp.skilled} onCheckedChange={(checked: boolean) => handleManpowerChange(index, 'skilled', checked)} />
              <Label>{mp.skilled ? 'Skilled' : 'Unskilled'}</Label>
            </div>
            <Input value={mp.hours} onChange={e => handleManpowerChange(index, 'hours', e.target.value)} placeholder="Total Hours" />
          </div>
        ))}
      </section>

      {/* Machinery Section */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Machinery Utilized</h3>
        {machinery.map((m, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-2">
            <Input value={m.name} onChange={e => handleMachineryChange(index, 'name', e.target.value)} placeholder="Machine Name" />
            <Input value={m.hours} onChange={e => handleMachineryChange(index, 'hours', e.target.value)} placeholder="Hours Used" />
            <Input value={m.remarks} onChange={e => handleMachineryChange(index, 'remarks', e.target.value)} placeholder="Remarks" />
          </div>
        ))}
      </section>

      {/* Activities Section */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Activities Carried Out</h3>
        {activities.map((a, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 mb-2">
            <Input value={a.description} onChange={e => handleActivityChange(index, 'description', e.target.value)} placeholder="Description" />
            <Input value={a.unit} onChange={e => handleActivityChange(index, 'unit', e.target.value)} placeholder="Unit" />
            <Input value={a.quantity} onChange={e => handleActivityChange(index, 'quantity', e.target.value)} placeholder="Quantity" />
            <Input value={a.remarks} onChange={e => handleActivityChange(index, 'remarks', e.target.value)} placeholder="Remarks" />
          </div>
        ))}
      </section>

      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Spinner className="w-4 h-4" />
            Updating...
          </div>
        ) : (
          'Update Report'
        )}
      </Button>
    </div>
  );
}
