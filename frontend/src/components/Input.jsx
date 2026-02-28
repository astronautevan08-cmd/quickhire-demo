export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring ${className}`}
    />
  );
}