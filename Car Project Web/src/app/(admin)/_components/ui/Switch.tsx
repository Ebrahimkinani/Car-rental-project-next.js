"use client";
import { memo } from "react";

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
};

function BaseSwitch({ checked, onChange, disabled, id, ...aria }: Props) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      className={[
        "inline-flex h-6 w-10 items-center rounded-full transition-colors",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        checked ? "bg-zinc-900" : "bg-zinc-300",
      ].join(" ")}
      onClick={() => !disabled && onChange(!checked)}
      {...aria}
    >
      <span
        className={[
          "ml-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-4" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}
export default memo(BaseSwitch);