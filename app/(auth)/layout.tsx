export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-green-100 px-4 py-12">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-3xl shadow-lg">
          ⚽
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Pelada App</h1>
        <p className="text-sm text-gray-500">
          Organize sua pelada de fim de semana
        </p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
