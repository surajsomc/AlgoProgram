"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-secondary text-xs px-3 py-1.5"
    >
      Print
    </button>
  );
}
