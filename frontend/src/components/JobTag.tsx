interface JobTagProps {
  label: string;
  variant: "fulltime" | "marketing" | "design" | "business" | "technology";
}

const variantStyles: Record<string, string> = {
  fulltime: "bg-green-light text-green border-green/20",
  marketing: "bg-yellow-light text-accent border-accent/20",
  design: "bg-indigo-light text-primary border-primary/20",
  business: "bg-cyan-light text-cyan border-cyan/20",
  technology: "bg-destructive/10 text-destructive border-destructive/20",
};

const JobTag = ({ label, variant }: JobTagProps) => {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${variantStyles[variant] || variantStyles.design}`}>
      {label}
    </span>
  );
};

export default JobTag;
