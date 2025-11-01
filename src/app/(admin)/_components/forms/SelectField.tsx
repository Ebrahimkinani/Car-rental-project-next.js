"use client";
import { memo } from "react";

type Option = { value: string; label: string };
type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  description?: string;
};

function SelectField({ id, label, value, onChange, options, description }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-zinc-600">{label}</label>
      <select
        id={id}
        className="w-full rounded border p-2 text-sm"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        aria-describedby={description ? `${id}-desc` : undefined}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {description ? <p id={`${id}-desc`} className="mt-1 text-xs text-zinc-500">{description}</p> : null}
    </div>
  );
}

export default memo(SelectField);