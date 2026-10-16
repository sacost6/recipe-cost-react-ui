import { useRef } from 'react';
import RecipeInstructionsMarkdown from './RecipeInstructionsMarkdown';

interface InstructionsEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxLength?: number;
}

export default function InstructionsEditor({
  value,
  onChange,
  disabled = false,
  maxLength,
}: InstructionsEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function wrapSelection(marker: string) {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? start;
    const selected = value.slice(start, end);
    const content = selected || 'text';
    const replacement = `${marker}${content}${marker}`;
    onChange(`${value.slice(0, start)}${replacement}${value.slice(end)}`);
    requestAnimationFrame(() => {
      textarea?.focus();
      const selectionStart = start + marker.length;
      textarea?.setSelectionRange(
        selectionStart,
        selectionStart + content.length,
      );
    });
  }

  function insertList(numbered: boolean) {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? start;
    const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
    const nextLineBreak = value.indexOf('\n', end);
    const lineEnd = nextLineBreak < 0 ? value.length : nextLineBreak;
    const selected = value.slice(lineStart, lineEnd) || 'Step';
    const prefix = numbered ? (index: number) => `${index + 1}. ` : () => '- ';
    const replacement = selected
      .split('\n')
      .map((line, index) => `${prefix(index)}${line}`)
      .join('\n');
    onChange(
      `${value.slice(0, lineStart)}${replacement}${value.slice(lineEnd)}`,
    );
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(lineStart, lineStart + replacement.length);
    });
  }

  return (
    <section className="space-y-2" aria-labelledby="recipe-instructions-label">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="recipe-instructions-label" className="text-sm font-medium">
          Instructions
        </h3>
        <p className="text-xs text-muted">Markdown supported</p>
      </div>
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <div className="min-w-0">
          <div
            className="mb-2 flex flex-wrap gap-1.5"
            role="group"
            aria-label="Text formatting"
          >
            <button
              type="button"
              aria-label="Bold"
              title="Bold"
              onClick={() => wrapSelection('**')}
              disabled={disabled}
              className="size-9 rounded border border-border text-sm font-semibold hover:bg-canvas focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
            >
              B
            </button>
            <button
              type="button"
              aria-label="Italic"
              title="Italic"
              onClick={() => wrapSelection('*')}
              disabled={disabled}
              className="size-9 rounded border border-border text-sm italic hover:bg-canvas focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
            >
              I
            </button>
            <button
              type="button"
              aria-label="Numbered list"
              title="Numbered list"
              onClick={() => insertList(true)}
              disabled={disabled}
              className="size-9 rounded border border-border text-sm hover:bg-canvas focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
            >
              1.
            </button>
            <button
              type="button"
              aria-label="Bulleted list"
              title="Bulleted list"
              onClick={() => insertList(false)}
              disabled={disabled}
              className="size-9 rounded border border-border text-base hover:bg-canvas focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
            >
              •
            </button>
          </div>
          <textarea
            ref={textareaRef}
            id="recipe-instructions"
            aria-label="Instructions"
            rows={3}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            maxLength={maxLength}
            disabled={disabled}
            className="min-h-24 w-full resize-y rounded-lg border border-input-border bg-white px-3 py-2.5 text-sm leading-6 focus-visible:outline-2 focus-visible:outline-primary"
          />
          <p className="mt-1 text-xs text-muted">
            Select text to format it, or use the list buttons on the current
            line.
          </p>
        </div>
        <div
          className="min-h-24 rounded-lg border border-border bg-canvas/50 p-3 sm:p-4"
          aria-label="Instructions preview"
          aria-live="polite"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
            Preview
          </p>
          {value.trim() ? (
            <RecipeInstructionsMarkdown>{value}</RecipeInstructionsMarkdown>
          ) : (
            <p className="text-sm text-muted">
              Formatted instructions appear here as you type.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
