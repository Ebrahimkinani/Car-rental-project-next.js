export default function CarDetailsLoading() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto animate-pulse px-4 sm:px-6 lg:px-8">
        <div className="mb-8 h-64 rounded-2xl bg-gray-200" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="h-8 w-1/3 rounded bg-gray-200" />
            <div className="h-40 rounded-xl bg-gray-100" />
          </div>
          <div className="h-80 rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
