export default function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring ${className}`}
    />
  );
}