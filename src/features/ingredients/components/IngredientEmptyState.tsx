export default function IngredientEmptyState() {
  return (
    <div className="w-full rounded-lg border border-border bg-surface p-8 text-center">
      <p className="text-sm font-medium text-text">No ingredients yet</p>
      <p className="mt-1 text-sm text-muted">
        Add your first ingredient to start tracking recipe costs.
      </p>
    </div>
  );
}
