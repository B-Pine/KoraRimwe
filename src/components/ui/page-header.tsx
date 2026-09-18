import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('border-b border-border bg-surface', className)}>
      <div className="container py-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
            )}
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h1>
            {description && (
              <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
