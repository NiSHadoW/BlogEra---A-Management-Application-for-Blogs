// Shared centered-card shell for register/login/forgot-password/reset-password
// so all four auth forms look consistent instead of each re-styling its own wrapper.
export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
