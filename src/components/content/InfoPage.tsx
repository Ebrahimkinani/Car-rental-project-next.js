import Link from "next/link";

interface InfoPageProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function InfoPage({ title, description, children }: InfoPageProps) {
  return (
    <main className="min-h-screen bg-white pt-28 pb-16">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-4 text-lg text-gray-600">{description}</p>
        ) : null}
        {children ? (
          <div className="prose prose-gray mt-8 max-w-none space-y-4 text-gray-700">
            {children}
          </div>
        ) : null}
      </div>
    </main>
  );
}
