import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
      <h2 className="mb-2 text-xl font-semibold">Page not found</h2>
      <p className="mb-4 text-muted-foreground max-w-md">
        We couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent text-accent-foreground"
      >
        Go back home
      </Link>
    </div>
  );
}
