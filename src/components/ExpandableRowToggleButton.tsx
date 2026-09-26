import type { ReactNode } from 'react';
import Button from './Button';

interface ExpandableRowToggleButtonProps {
  children: ReactNode;
  disabled?: boolean;
  isExpanded: boolean;
  label: string;
  onToggle: () => void;
  panelId: string;
}

export default function ExpandableRowToggleButton({
  children,
  disabled = false,
  isExpanded,
  label,
  onToggle,
  panelId,
}: ExpandableRowToggleButtonProps) {
  return (
    <Button
      type="button"
      variant="plain"
      aria-expanded={isExpanded}
      aria-controls={panelId}
      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${label}`}
      disabled={disabled}
      onClick={onToggle}
      className="inline-flex min-h-9 items-center gap-3 rounded text-left font-medium text-text"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-5 w-5 shrink-0 text-primary transition-transform motion-reduce:transition-none ${isExpanded ? 'rotate-90' : ''}`}
      >
        <path d="m9 5 7 7-7 7" />
      </svg>
      {children}
    </Button>
  );
}
