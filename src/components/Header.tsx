import { useId, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from './Button';
import Container from './Container';
import { useAuth } from '../features/users/AuthContext';
export default function Header() {
  const { user, isLoading, error, refreshUser, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const mobileMenuId = useId();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logout();
      closeMobileMenu();
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : 'Unable to logout',
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRetrySession = () => {
    setLogoutError(null);
    void refreshUser();
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'bg-primary/10 text-primary font-bold px-3 py-2 rounded-lg transition duration-150 border border-primary/20'
      : 'text-muted hover:text-text hover:bg-slate-100 px-3 py-2 rounded-lg transition duration-150 font-medium';

  const authActionClass =
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover';
  const renderAuthAction = () => {
    if (isLoading) {
      return (
        <span role="status" className="text-sm text-muted">
          Checking session...
        </span>
      );
    }

    if (error) {
      return (
        <Button
          type="button"
          variant="plain"
          onClick={handleRetrySession}
          className="text-sm font-medium underline"
        >
          Retry session check
        </Button>
      );
    }

    if (user) {
      return (
        <Button
          type="button"
          variant="plain"
          onClick={() => void handleLogout()}
          disabled={isLoggingOut}
          className={authActionClass}
        >
          {isLoggingOut ? 'Logging out...' : 'Log Out'}
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          onClick={closeMobileMenu}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text transition hover:bg-slate-100"
        >
          Log In
        </Link>

        <Link
          to="/register"
          onClick={closeMobileMenu}
          className={authActionClass}
        >
          Register
        </Link>
      </div>
    );
  };
  const authError = error ?? (user ? logoutError : null);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface text-text">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight"
          >
            <span aria-hidden="true" className="text-2xl text-primary">
              ❖
            </span>
            <span>Recipe Cost</span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="ml-auto mr-4 hidden items-center space-x-1 text-sm font-medium md:flex"
          >
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

          <div className="hidden items-center md:flex">
            {renderAuthAction()}
          </div>

          {/* Mobile menu toggle */}
          <Button
            type="button"
            variant="plain"
            aria-label={
              isMobileMenuOpen ? 'Close navigation' : 'Open navigation'
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls={mobileMenuId}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="rounded-lg p-2 text-text hover:bg-slate-100 md:hidden"
          >
            <svg
              aria-hidden="true"
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
          </Button>
        </div>
      </Container>

      {/* Mobile navigation */}
      <div
        id={mobileMenuId}
        hidden={!isMobileMenuOpen}
        className="bg-surface md:hidden"
      >
        <Container className="space-y-3 pt-2 pb-4">
          <nav aria-label="Mobile navigation" className="space-y-1">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block rounded-md px-3 py-2 font-medium hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              to="/ingredients"
              onClick={closeMobileMenu}
              className="block rounded-md px-3 py-2 font-medium hover:bg-slate-100"
            >
              Ingredients
            </Link>
            <Link
              to="/recipes"
              onClick={closeMobileMenu}
              className="block rounded-md px-3 py-2 font-medium hover:bg-slate-100"
            >
              Recipes
            </Link>
          </nav>

          <div>{renderAuthAction()}</div>
        </Container>
      </div>

      {/* Visible even when the mobile menu is closed */}
      {authError && (
        <Container className="pb-3">
          <p role="alert" className="text-sm text-red-700">
            {authError}
          </p>
        </Container>
      )}
    </header>
  );
}
