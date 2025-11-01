"use client";
import { memo } from "react";
import Switch from "../ui/Switch";

type Props = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  description?: string;
  disabled?: boolean;
};
function ToggleField({ id, label, checked, onChange, description, disabled }: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="mb-0.5 block text-sm font-medium text-zinc-700">{label}</label>
        {description ? <p className="text-xs text-zinc-500">{description}</p> : null}
      </div>
      <Switch id={id} checked={checked} onChange={onChange} aria-label={label} disabled={disabled} />
    </div>
  );
}

export default memo(ToggleField);