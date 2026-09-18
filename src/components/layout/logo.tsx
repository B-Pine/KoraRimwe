import { cn } from '@/lib/utils';

/**
 * Brand mark: a road-sign shield with a checkmark cut through it —
 * "study once, pass with confidence".
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="KoraRimwe"
      className={cn('h-8 w-8', className)}
    >
      <path
        d="M16 2.5 26.5 7v9.2c0 6.3-4.2 11.4-10.5 13.3C9.7 27.6 5.5 22.5 5.5 16.2V7L16 2.5Z"
        className="fill-primary"
      />
      <path
        d="m11 16.3 3.5 3.6 6.6-7.1"
        fill="none"
        stroke="currentColor"
        className="text-primary-foreground"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className, showTagline = false }: { className?: string; showTagline?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          KoraRimwe
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Prepare. Practice. Pass.
          </span>
        )}
      </span>
    </span>
  );
}
