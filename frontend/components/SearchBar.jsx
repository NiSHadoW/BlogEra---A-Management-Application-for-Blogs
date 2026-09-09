"use client";

import { useEffect, useRef, useState } from "react";

// Controlled-ish search input: keeps its own draft state for instant typing
// feedback, but only calls onSearch (debounced) once the user pauses, so we
// don't fire a GET /api/blogs?title= request on every keystroke.
export default function SearchBar({
  initialValue = "",
  onSearch,
  placeholder = "Search blogs...",
  className = "",
  liveSearch = true,
}) {
  const [value, setValue] = useState(initialValue);
  const debounceRef = useRef(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const scheduleSearch = (nextValue) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(nextValue.trim()), 400);
  };

  const handleChange = (e) => {
    const nextValue = e.target.value;
    setValue(nextValue);
    if (liveSearch) scheduleSearch(nextValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </form>
  );
}
