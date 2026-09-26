// Drop-in shimmer placeholders while data loads.
// <SkeletonLines count={3} /> for text rows, <SkeletonCard /> for a task/board card.

export function SkeletonLines({ count = 3 }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="tm-skeleton tm-skeleton--line"
          style={{ width: i === count - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return <div className="tm-skeleton tm-skeleton--card" />;
}

// For a button mid-submit: <SpinnerButton loading={isSaving} onClick={handleSave}>Save</SpinnerButton>
export function SpinnerButton({ loading, children, className = '', ...props }) {
  return (
    <button className={`tm-btn ${className}`} disabled={loading} {...props}>
      {loading ? <span className="tm-spinner" /> : children}
    </button>
  );
}
