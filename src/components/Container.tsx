import type { ComponentPropsWithoutRef } from 'react';

type ContainerProps = ComponentPropsWithoutRef<'div'>;

export default function Container({
  className = '',
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      {...props}
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
