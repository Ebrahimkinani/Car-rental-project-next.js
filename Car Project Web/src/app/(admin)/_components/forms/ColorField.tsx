"use client";
import { memo } from "react";

type Props = {
  id: string;
  label: string;
  value: string;           // hex
  onChange: (v: string) => void;
};
function ColorField({ id, label, value, onChange }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-zinc-600">{label}</label>
      <div className="flex items-center gap-2">
        <input id={id} type="color" value={value} onChange={(e)=>onChange(e.target.value)} className="h-9 w-12 rounded border" />
        <input
          className="w-full rounded border p-2 text-sm"
          value={value}
          onChange={(e)=>onChange(e.target.value)}
          placeholder="#000000"
          aria-label={`${label} hex`}
        />
      </div>
    </div>
  );
}
export default memo(ColorField);