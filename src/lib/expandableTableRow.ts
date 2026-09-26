import type { MouseEvent } from 'react';

interface ExpandableTableRowOptions {
  disabled: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export function getExpandableTableRowProps({
  disabled,
  isExpanded,
  onToggle,
}: ExpandableTableRowOptions) {
  return {
    onClick(event: MouseEvent<HTMLTableRowElement>) {
      if (
        disabled ||
        (event.target instanceof Element &&
          event.target.closest('button, a, input, select, textarea, dialog'))
      ) {
        return;
      }

      event.currentTarget
        .querySelector<HTMLButtonElement>('button[aria-expanded]')
        ?.focus({ preventScroll: true });
      onToggle();
    },
    className: `border-t border-border transition-colors ${
      disabled
        ? ''
        : 'cursor-pointer hover:bg-green-50 focus-within:bg-green-50'
    } ${isExpanded ? 'bg-background' : ''}`,
  };
}
