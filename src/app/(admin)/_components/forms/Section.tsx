import { memo, PropsWithChildren } from "react";

type Props = PropsWithChildren<{ title: string; description?: string }>;
function Section({ title, description, children }: Props) {
  return (
    <section className="rounded-xl border bg-secondary-gradient p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        {description ? <p className="mt-1 text-xs text-zinc-500">{description}</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export default memo(Section);