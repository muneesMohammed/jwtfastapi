'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';
import Spinner from '@/components/spinner'; // Make sure you create this (see below)

export default function DailyLogForm() {
  const [manpower, setManpower] = useState([{ id: '', name: '', category: '', skilled: false, hours: '' }]);
  const [machinery, setMachinery] = useState([{ name: '', hours: '', remarks: '' }]);
  const [activities, setActivities] = useState([{ description: '', unit: '', quantity: '', remarks: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const router = useRouter();

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    setIsSubmitting(true);

    const payload = {
      date: new Date().toISOString().split("T")[0],
      project_id: 1,
      manpower: manpower.map(mp => ({
        worker_id: mp.id,
        name: mp.name,
        category: mp.category,
        total_hours: Number(mp.hours),
        skilled: mp.skilled
      })),
      machinery: machinery.map(m => ({
        machinery_name: m.name,
        hours_used: Number(m.hours),
        remarks: m.remarks
      })),
      activities: activities.map(a => ({
        activity_name: a.description,
        unit: a.unit,
        quantity: a.quantity,
        remarks: a.remarks
      }))
    };


    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/daily-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('✅ Report submitted successfully!');
        setTimeout(() => {
          router.push('/foreman/daily-report-list'); // Redirect to dashboard
        }, 2000); // Slightly shorter delay for better UX
      }
      else {
        toast.error(`❌ ${data.detail || 'Something went wrong.'}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('🚨 Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL);
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h2 className="text-2xl font-bold">Daily Gang Productivity Report</h2>

      {/* Manpower Section */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Manpower Utilized</h3>
        {manpower.map((mp, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 mb-2 items-center">
            <Input placeholder="ID" value={mp.id} onChange={e => {
              const updated = [...manpower];
              updated[index].id = e.target.value;
              setManpower(updated);
            }} />
            <Input placeholder="Name" value={mp.name} onChange={e => {
              const updated = [...manpower];
              updated[index].name = e.target.value;
              setManpower(updated);
            }} />
            <Input placeholder="Category" value={mp.category} onChange={e => {
              const updated = [...manpower];
              updated[index].category = e.target.value;
              setManpower(updated);
            }} />
            <div className="flex items-center space-x-2">
              <Checkbox checked={mp.skilled} onCheckedChange={val => {
                const updated = [...manpower];
                updated[index].skilled = val as boolean;
                setManpower(updated);
              }} />
              <Label>{mp.skilled ? 'Skilled' : 'Unskilled'}</Label>
            </div>
            <Input placeholder="Total Hours" value={mp.hours} onChange={e => {
              const updated = [...manpower];
              updated[index].hours = e.target.value;
              setManpower(updated);
            }} />
          </div>
        ))}
        <Button variant="outline" onClick={() => setManpower([...manpower, { id: '', name: '', category: '', skilled: false, hours: '' }])}>
          + Add Manpower
        </Button>
      </div>

      {/* Machinery Section */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Machinery Utilized</h3>
        {machinery.map((m, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-2">
            <Input placeholder="Machine Name" value={m.name} onChange={e => {
              const updated = [...machinery];
              updated[index].name = e.target.value;
              setMachinery(updated);
            }} />
            <Input placeholder="Hours Used" value={m.hours} onChange={e => {
              const updated = [...machinery];
              updated[index].hours = e.target.value;
              setMachinery(updated);
            }} />
            <Input placeholder="Remarks" value={m.remarks} onChange={e => {
              const updated = [...machinery];
              updated[index].remarks = e.target.value;
              setMachinery(updated);
            }} />
          </div>
        ))}
        <Button variant="outline" onClick={() => setMachinery([...machinery, { name: '', hours: '', remarks: '' }])}>
          + Add Machinery
        </Button>
      </div>

      {/* Activities Section */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Activities Carried Out</h3>
        {activities.map((a, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 mb-2">
            <Input placeholder="Description" value={a.description} onChange={e => {
              const updated = [...activities];
              updated[index].description = e.target.value;
              setActivities(updated);
            }} />
            <Input placeholder="Unit" value={a.unit} onChange={e => {
              const updated = [...activities];
              updated[index].unit = e.target.value;
              setActivities(updated);
            }} />
            <Input placeholder="Quantity" value={a.quantity} onChange={e => {
              const updated = [...activities];
              updated[index].quantity = e.target.value;
              setActivities(updated);
            }} />
            <Input placeholder="Remarks" value={a.remarks} onChange={e => {
              const updated = [...activities];
              updated[index].remarks = e.target.value;
              setActivities(updated);
            }} />
          </div>
        ))}
        <Button variant="outline" onClick={() => setActivities([...activities, { description: '', unit: '', quantity: '', remarks: '' }])}>
          + Add Activity
        </Button>
      </div>

      {/* Submit Button */}
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Spinner className="w-4 h-4" />
            Submitting...
          </div>
        ) : (
          'Submit Report'
        )}
      </Button>

  
    </div>
  );
}
