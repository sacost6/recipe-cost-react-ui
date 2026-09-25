import Container from './Container';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface text-sm text-muted">
      <Container className="py-6">
        <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-3">
          {/* Brand */}
          <div className="flex items-center gap-2 justify-self-center font-medium text-text md:justify-self-start">
            <span aria-hidden="true" className="text-xl text-primary">
              ❖
            </span>
            <span className="whitespace-nowrap">Recipe Cost</span>
          </div>

          {/* Quick links */}
          <nav
            aria-label="Footer"
            className="flex flex-wrap justify-center justify-self-center gap-x-4 gap-y-2"
          >
            <a href="#ingredients" className="transition hover:text-primary">
              Ingredients
            </a>
            <a href="#recipes" className="transition hover:text-primary">
              Recipes
            </a>
            <a href="#privacy" className="transition hover:text-primary">
              Privacy
            </a>
          </nav>

          {/* Copyright */}
          <p className="justify-self-center text-center text-xs md:justify-self-end md:text-right">
            © {currentYear} Simon Acosta.
          </p>
        </div>
      </Container>
    </footer>
  );
}
