import { Palette, TrendingUp, Megaphone, DollarSign, Monitor, Code, Briefcase, Users, ArrowRight } from "lucide-react";

const categories = [
  { icon: Palette, name: "Design", count: 235, color: "text-primary" },
  { icon: TrendingUp, name: "Sales", count: 756, color: "text-secondary" },
  { icon: Megaphone, name: "Marketing", count: 140, color: "text-primary", featured: false },
  { icon: DollarSign, name: "Finance", count: 325, color: "text-muted-foreground" },
  { icon: Monitor, name: "Technology", count: 436, color: "text-muted-foreground" },
  { icon: Code, name: "Engineering", count: 542, color: "text-muted-foreground" },
  { icon: Briefcase, name: "Business", count: 211, color: "text-muted-foreground" },
  { icon: Users, name: "Human Resource", count: 346, color: "text-muted-foreground" },
];

const CategorySection = () => {
  return (
    <section className="container mx-auto px-4 md:px-8 py-16">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Explore by <span className="text-primary">category</span>
        </h2>
        <a href="#" className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
          Show all jobs <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className={`group border border-border rounded-lg p-6 cursor-pointer transition-all hover:bg-primary hover:border-primary ${
                cat.featured ? "bg-primary border-primary" : "bg-background"
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                cat.featured ? "bg-primary-foreground/20" : "bg-muted"
              } group-hover:bg-primary-foreground/20`}>
                <Icon className={`w-6 h-6 ${cat.featured ? "text-primary-foreground" : cat.color} group-hover:text-primary-foreground`} />
              </div>
              <h3 className={`font-semibold text-lg mb-1 ${cat.featured ? "text-primary-foreground" : "text-foreground"} group-hover:text-primary-foreground`}>
                {cat.name}
              </h3>
              <div className={`flex items-center gap-2 text-sm ${cat.featured ? "text-primary-foreground/80" : "text-muted-foreground"} group-hover:text-primary-foreground/80`}>
                <span>{cat.count} jobs available</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
