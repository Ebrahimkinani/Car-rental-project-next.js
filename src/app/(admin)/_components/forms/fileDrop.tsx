"use client";
import { memo, useRef } from "react";

type Props = {
  id: string;
  label: string;
  onFile: (file: File) => void;
  hint?: string;
};
function FileDrop({ id, label, onFile, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-600">{label}</label>
      <div
        className="flex cursor-pointer items-center justify-center rounded border border-dashed bg-zinc-50 p-6 text-sm text-zinc-600 hover:bg-zinc-100"
        onClick={()=>inputRef.current?.click()}
        role="button"
        aria-label="Upload file"
      >
        Click to upload (mock)
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        className="hidden"
        onChange={(e)=>{ const f = e.target.files?.[0]; if (f) onFile(f); }}
      />
      {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
    </div>
  );
}

export default memo(FileDrop);