import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] max-w-md flex-col items-center justify-center py-16 text-center">
      <p className="font-display text-5xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        That page does not exist. It may have been moved, or the link may be incomplete.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/study">Go to study</Link>
        </Button>
      </div>
    </div>
  );
}
