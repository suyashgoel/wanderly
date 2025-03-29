import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function SearchBar({
  onQueryChange,
}: {
  onQueryChange: (query: string | "") => void;
}) {
  const [query, setQuery] = useState<string>("");
  const suggestions = [
    "Discover hidden gems",
    "Explore new cities",
    "Find travel inspiration",
  ];
  const [placeholder, setPlaceholder] = useState<string>(suggestions[0]);

  // Cycle through placeholder suggestions every 3 seconds.
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholder((prev) => {
        const currentIndex = suggestions.indexOf(prev);
        return suggestions[(currentIndex + 1) % suggestions.length];
      });
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  // Propagate query changes to parent.
  useEffect(() => {
    onQueryChange(query);
  }, [query, onQueryChange]);

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full max-w-lg px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0077FF] placeholder-opacity-75 font-inter text-lg transition-all duration-200"
    />
  );
}
