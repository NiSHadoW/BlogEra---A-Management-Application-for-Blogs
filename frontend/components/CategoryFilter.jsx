"use client";

export const CATEGORIES = ["All", "Testing", "Automation", "Programming", "API", "DevOps","Testing 2","AI"];

export default function CategoryFilter({ value = "All", onChange, className = "" }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {CATEGORIES.map((category) => {
        const isActive = category === value;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
