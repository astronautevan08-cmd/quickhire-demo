import dashboardPreview from "@/assets/dashboard-preview.png";
import Image from "next/image";

const CTABanner = () => {
  return (
    <section className="container mx-auto px-4 md:px-8 py-8">
      <div className="bg-primary rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
        <div className="flex-1">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground leading-tight mb-4">
            Start posting<br />jobs today
          </h2>
          <p className="text-primary-foreground/80 text-sm mb-6">Start posting jobs for only $10.</p>
          <button className="bg-primary-foreground text-primary px-6 py-3 rounded-md text-sm font-semibold hover:bg-primary-foreground/90 transition-colors">
            Sign Up For Free
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <Image
            src={dashboardPreview}
                width={600}
                height={512}
            alt="Dashboard preview"
            className="w-full max-w-sm rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
