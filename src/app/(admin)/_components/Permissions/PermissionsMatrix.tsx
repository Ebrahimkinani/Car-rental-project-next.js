"use client";

import { memo, useCallback, useMemo } from "react";
import Switch from "../ui/Switch";
import type { ModuleDef, PermAction, Role, RoleMatrix } from "../types/permission";
import { MODULES } from "./modules.config";

type Props = {
  role: Role;
  matrix: RoleMatrix;
  onToggle: (args: { role: Role; module: ModuleDef["key"]; action: PermAction; value: boolean }) => void;
  onRowAll: (args: { role: Role; module: ModuleDef["key"]; value: boolean }) => void;
  onColAll: (args: { role: Role; action: PermAction; value: boolean }) => void;
  readOnly?: boolean;
  filter: string;
};

const HeadCell = memo(function HeadCell({
  action, role, onColAll, anyEnabled
}: { action: PermAction; role: Role; onColAll: Props["onColAll"]; anyEnabled: boolean }) {
  const label = action[0].toUpperCase() + action.slice(1);
  const handle = useCallback(() => onColAll({ role, action, value: !anyEnabled }), [onColAll, role, action, anyEnabled]);
  return (
    <th scope="col" className="px-2 py-2 text-left text-xs font-medium text-zinc-600">
      <div className="flex items-center gap-2">
        <span>{label}</span>
        <button
          type="button"
          className="rounded border px-1.5 py-0.5 text-[10px]"
          onClick={handle}
          aria-label={`Toggle all ${label}`}
          title={`Toggle all ${label}`}
        >
          {anyEnabled ? "Uncheck all" : "Check all"}
        </button>
      </div>
    </th>
  );
});

export default function PermissionsMatrix({ role, matrix, onToggle, onRowAll, onColAll, readOnly, filter }: Props) {
  const modules = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? MODULES.filter((m: ModuleDef) => m.label.toLowerCase().includes(q)) : MODULES;
  }, [filter]);

  const actionsUnion = useMemo(() => {
    const set = new Set<PermAction>();
    MODULES.forEach((m: ModuleDef) => m.actions.forEach((a: PermAction) => set.add(a)));
    return Array.from(set);
  }, []);

  // Safety check: ensure matrix[role] exists
  if (!matrix[role]) {
    return (
      <div className="flex items-center justify-center p-12 text-center text-sm text-zinc-500">
        Loading permissions...
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-xl border bg-secondary-gradient">
      <table className="min-w-[720px] text-sm">
        <thead className="bg-zinc-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-zinc-600">Module</th>
            {actionsUnion.map((a: PermAction) => {
              const anyEnabled = MODULES.some((m: ModuleDef) => m.actions.includes(a) && matrix[role]?.[m.key]?.[a]);
              return <HeadCell key={a} action={a} role={role} onColAll={onColAll} anyEnabled={anyEnabled} />;
            })}
            <th className="px-3 py-2 text-left text-xs font-medium text-zinc-600">Row</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {modules.map((m: ModuleDef) => {
            const rowAllOn = m.actions.every((a: PermAction) => matrix[role]?.[m.key]?.[a]);
            const rowBtn = () =>
              !readOnly && (
                <button
                  type="button"
                  className="rounded border px-2 py-1 text-xs"
                  onClick={() => onRowAll({ role, module: m.key, value: !rowAllOn })}
                  aria-label={`Toggle all in ${m.label}`}
                >
                  {rowAllOn ? "Uncheck row" : "Check row"}
                </button>
              );

            return (
              <tr key={m.key} className="hover:bg-zinc-50">
                <th scope="row" className="px-3 py-2 font-medium text-zinc-800">{m.label}</th>
                {actionsUnion.map((a) => {
                  const present = m.actions.includes(a);
                  const val = present ? (matrix[role]?.[m.key]?.[a] ?? false) : false;
                  const cellId = `${m.key}-${a}`;
                  return (
                    <td key={a} className="px-2 py-2">
                      {present ? (
                        <Switch
                          id={cellId}
                          aria-label={`${m.label} • ${a}`}
                          checked={val}
                          onChange={(next: boolean) => onToggle({ role, module: m.key, action: a, value: next })}
                          disabled={readOnly || (m.key === "permissions" && a !== "view" && role !== "Admin")}
                        />
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-3 py-2">{rowBtn()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}