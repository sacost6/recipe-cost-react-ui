import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Container from './Container';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'bg-primary/10 text-primary font-bold px-3 py-2 rounded-lg transition duration-150 border border-primary/20'
      : 'text-muted hover:text-text hover:bg-slate-100 px-3 py-2 rounded-lg transition duration-150 font-medium';

  return (
    <header className="bg-surface border-b border-border text-text sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="shrink-0 font-bold text-xl tracking-tight text-text">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-primary text-2xl">❖</span>
              <span>Recipe Cost</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium ml-auto mr-4">
            <NavLink to="/" end className={getNavLinkClass}>
              Home
            </NavLink>
            <NavLink to="/ingredients" className={getNavLinkClass}>
              Ingredients
            </NavLink>
            <NavLink to="/recipes" className={getNavLinkClass}>
              Recipes
            </NavLink>
          </nav>

          {/* Primary Action */}
          <div className="hidden md:flex items-center">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center bg-primary hover:bg-primary-hover text-white font-semibold px-4 py-2 rounded-lg text-sm transition duration-150"
            >
              Log In
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text hover:bg-slate-100 p-2 rounded-lg focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMobileMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border">
          <Container className="space-y-1 pt-2 pb-4">
            <Link
              to="/ingredients"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-text hover:bg-slate-100"
            >
              Ingredients
            </Link>
            <Link
              to="/recipes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-text hover:bg-slate-100"
            >
              Recipes
            </Link>
            <div className="pt-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center bg-primary hover:bg-primary-hover text-white font-semibold px-4 py-2 rounded-lg text-sm transition duration-150"
              >
                Log In
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
