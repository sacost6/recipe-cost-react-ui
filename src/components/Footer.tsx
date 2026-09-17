export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border text-muted text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Creator Info */}
          <div className="flex items-center gap-2 text-text font-medium">
            <span className="text-primary text-xl">❖</span>
            <span>Recipe Cost</span>
            <span className="text-muted font-normal">
              • Created by{' '}
              <span className="text-text font-semibold">Simon Acosta</span>
            </span>
          </div>

          {/* Quick Links */}
          <nav className="flex items-center space-x-6">
            <a
              href="#ingredients"
              className="hover:text-primary transition duration-150"
            >
              Ingredients
            </a>
            <a
              href="#recipes"
              className="hover:text-primary transition duration-150"
            >
              Recipes
            </a>
            <a
              href="#privacy"
              className="hover:text-primary transition duration-150"
            >
              Privacy
            </a>
          </nav>

          {/* Dynamic Copyright */}
          <div className="text-xs text-muted">
            © {currentYear} Simon Acosta. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
