'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="job-description" className="text-base font-semibold">
        Paste Job Description
      </Label>
      <Textarea
        id="job-description"
        placeholder="Paste the complete job description here including required skills, qualifications, and responsibilities..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[300px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
      <p className="text-sm text-gray-500">
        {value.length} characters • The more detailed, the better the analysis
      </p>
    </div>
  );
}