const companies = ["Vodafone", "Intel", "Tesla", "AMD", "Talkit"];

const CompanyLogos = () => {
  return (
    <section className="border-y border-border py-8">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-xs text-muted-foreground mb-6">Companies we helped grow</p>
        <div className="flex items-center justify-between flex-wrap gap-6">
          {companies.map((company) => (
            <span key={company} className="font-display text-lg md:text-xl font-semibold text-muted-foreground/60 tracking-wider">
              {company === "Tesla" ? "T E S L A" : company === "AMD" ? "AMD" : company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyLogos;
