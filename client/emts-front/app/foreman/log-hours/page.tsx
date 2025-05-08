'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

type CheckboxType = 'section' | 'precheck'

export default function GangProductivityForm() {
  const [formData, setFormData] = useState({
    projectNo: '',
    projectName: '',
    date: '',
    supervisorName: '',
    supervisorDesignation: '',
    section: [] as string[],
    precheck: [] as string[],
  })

  const sectionOptions = ['Hard Landscape', 'Soft Landscape', 'Irrigation', 'MEP', 'HS Finishes', 'Others']
  const precheckOptions = [
    'Availability of Construction NOC & Permits',
    'Engineering Approvals',
    'Material Availability at Site',
  ]

  const handleCheckboxChange = (type: CheckboxType, value: string) => {
    setFormData(prev => {
      const selected = new Set(prev[type])
      if (selected.has(value)) {
        selected.delete(value)
      } else {
        selected.add(value)
      }
      return { ...prev, [type]: Array.from(selected) }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submit-gang-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success('Report submitted successfully')
        setFormData({
          projectNo: '',
          projectName: '',
          date: '',
          supervisorName: '',
          supervisorDesignation: '',
          section: [],
          precheck: [],
        })
      } else {
        const err = await res.json()
        toast.error(err.detail || 'Failed to submit')
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Gang Productivity Report</h2>

      <div>
        <Label>Project No</Label>
        <Input name="projectNo" value={formData.projectNo} onChange={handleChange} />
      </div>
      <div>
        <Label>Project Name</Label>
        <Input name="projectName" value={formData.projectName} onChange={handleChange} />
      </div>
      <div>
        <Label>Date</Label>
        <Input type="date" name="date" value={formData.date} onChange={handleChange} />
      </div>
      <div>
        <Label>Supervisor Name</Label>
        <Input name="supervisorName" value={formData.supervisorName} onChange={handleChange} />
      </div>
      <div>
        <Label>Supervisor Designation</Label>
        <Input name="supervisorDesignation" value={formData.supervisorDesignation} onChange={handleChange} />
      </div>

      <div>
        <Label>Section</Label>
        <div className="grid grid-cols-2 gap-2">
          {sectionOptions.map(option => (
            <label key={option} className="flex items-center gap-2">
              <Checkbox
                checked={formData.section.includes(option)}
                onCheckedChange={() => handleCheckboxChange('section', option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Activity Precheck</Label>
        <div className="grid grid-cols-2 gap-2">
          {precheckOptions.map(option => (
            <label key={option} className="flex items-center gap-2">
              <Checkbox
                checked={formData.precheck.includes(option)}
                onCheckedChange={() => handleCheckboxChange('precheck', option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  )
}
