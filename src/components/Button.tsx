import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  to?: string; //used to route in app
  href?: string; // kept for external linkes
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-label'?: string;
}

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  'aria-label': ariaLabel,
}: ButtonProps) {
  // Base classes applied to all button variants
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition duration-150 focus:outline-none focus:ring-2 focus:ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  // Style variations
  const variants = {
    primary:
      'bg-primary hover:bg-primary-hover text-white px-6 py-3 shadow-md shadow-primary/20 focus:ring-primary',
    secondary:
      'bg-surface hover:bg-slate-50 border border-border text-text px-6 py-3 shadow-xs focus:ring-slate-300',
    outline:
      'border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 focus:ring-primary',
    destructive:
      'bg-red-600 hover:bg-red-700 text-white px-6 py-3 shadow-md shadow-red-600/20 focus:ring-red-500',
  };

  const handleClick = disabled ? undefined : onClick;
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const combinedClasses = `${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`;

  // If a 'to' value is passed, internal client navigation
  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={combinedClasses}
        aria-label={ariaLabel}
        aria-disabled={disabled ? 'true' : undefined}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </Link>
    );
  }
  // If an href is passed, render an <a> tag for external link, otherwise render a <button>
  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        onClick={handleClick}
        className={combinedClasses}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedClasses}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
