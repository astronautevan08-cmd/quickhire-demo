export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring";
  const styles = {
    primary: "bg-black text-white hover:opacity-90",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:opacity-90",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}