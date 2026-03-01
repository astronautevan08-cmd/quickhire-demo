import Link from "next/link";
const QuickHireFooter = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">
                  Q
                </span>
              </div>
              <span className="font-display font-semibold text-lg">
                QuickHire
              </span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              Great platform for the job seeker that passionate about startups.
              Find your dream job easier.
            </p>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Companies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Advice
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Help Docs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Updates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Contact Us
                </a>
              </li>
              <Link
                href="/admin"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Get job notifications</h4>
            <p className="text-sm text-background/60 mb-4">
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-background/10 border border-background/20 rounded-l-md px-4 py-2 text-sm text-background placeholder:text-background/40 outline-none flex-1"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-r-md text-sm font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/40">
            2021 © QuickHire. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["f", "◎", "◉", "in", "▶"].map((icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-full border border-background/20 flex items-center justify-center text-xs text-background/60 hover:text-background transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default QuickHireFooter;
