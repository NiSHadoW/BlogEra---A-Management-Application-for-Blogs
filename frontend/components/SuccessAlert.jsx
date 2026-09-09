export default function SuccessAlert({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      {message}
    </div>
  );
}
