"use client";
import { memo } from "react";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email" | "tel" | "number";
  placeholder?: string;
  required?: boolean;
  min?: number;
  step?: number;
  description?: string;
};
function TextField({ id, label, value, onChange, type="text", placeholder, required, min, step, description }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-zinc-600">{label}</label>
      <input
        id={id}
        className="w-full rounded border p-2 text-sm"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        aria-describedby={description ? `${id}-desc` : undefined}
        required={required}
        min={min}
        step={step}
      />
      {description ? <p id={`${id}-desc`} className="mt-1 text-xs text-zinc-500">{description}</p> : null}
    </div>
  );
}
export default memo(TextField);