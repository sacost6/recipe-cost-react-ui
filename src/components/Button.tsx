import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'destructive' | 'plain';

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

// Keep native attributes, event targets, and refs specific to each element.
type NativeButtonProps = SharedProps &
  ComponentPropsWithRef<'button'> & {
    to?: never;
    href?: never;
  };

type RouterButtonProps = SharedProps &
  ComponentPropsWithRef<typeof Link> & {
    href?: never;
    disabled?: boolean;
  };

type AnchorButtonProps = SharedProps &
  ComponentPropsWithRef<'a'> & {
    to?: never;
    href: string;
    disabled?: boolean;
  };

type ButtonProps = NativeButtonProps | RouterButtonProps | AnchorButtonProps;

const baseStyles =
  'inline-flex items-center justify-center font-bold rounded-xl transition duration-150 focus:outline-none focus:ring-2 focus:ring focus:ring-offset-2';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary hover:bg-primary-hover text-white px-6 py-3 shadow-md shadow-primary/20 focus:ring-primary',
  secondary:
    'bg-surface hover:bg-slate-50 border border-border text-text px-6 py-3 shadow-xs focus:ring-slate-300',
  outline:
    'border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 focus:ring-primary',
  destructive:
    'bg-red-600 hover:bg-red-700 text-white px-6 py-3 shadow-md shadow-red-600/20 focus:ring-red-500',
  plain: 'focus-visible:outline-2 focus-visible:outline-offset-2',
};

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    className = '',
    disabled = false,
    ...elementProps
  } = props;

  const combinedClasses = [
    variant === 'plain' ? '' : baseStyles,
    variants[variant],
    'disabled:opacity-50 disabled:pointer-events-none',
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (elementProps.to !== undefined) {
    const { onClick, tabIndex, ...linkProps } = elementProps;

    return (
      <Link
        {...linkProps}
        className={combinedClasses}
        aria-disabled={disabled || linkProps['aria-disabled']}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }

          onClick?.(event);
        }}
      />
    );
  }

  if (elementProps.href !== undefined) {
    const { href, onClick, tabIndex, ...anchorProps } = elementProps;

    return (
      <a
        {...anchorProps}
        href={disabled ? undefined : href}
        className={combinedClasses}
        aria-disabled={disabled || anchorProps['aria-disabled']}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }

          onClick?.(event);
        }}
      />
    );
  }

  const { type = 'button', ...buttonProps } = elementProps;

  return (
    <button
      {...buttonProps}
      type={type}
      className={combinedClasses}
      disabled={disabled}
    />
  );
}
