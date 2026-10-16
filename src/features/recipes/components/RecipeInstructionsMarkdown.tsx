import ReactMarkdown from 'react-markdown';

interface RecipeInstructionsMarkdownProps {
  children: string;
}

export default function RecipeInstructionsMarkdown({
  children,
}: RecipeInstructionsMarkdownProps) {
  return (
    <div className="space-y-3 text-sm leading-6 text-text [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_p]:whitespace-pre-wrap [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
