"use client";

import { useState, useEffect } from "react";
import { ArticleCard } from "@/components/articleCard";
import { SearchBar } from "@/components/searchBar";
import { SearchDropdown } from "@/components/searchDropdown";
import { Article } from "@/types";

export default function ArticlesPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState<{
    tags: string[];
    city: string | null;
    sort: string | null;
  }>({
    tags: [],
    city: null,
    sort: null,
  });
  const [results, setResults] = useState<Article[]>([]);

  // Debounce the query to reduce unnecessary fetches
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Initial fetch of all articles (optional: you could remove if you only want data after user input)
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch articles");
        }

        setResults(data);
      } catch (err: any) {
        console.error("Error fetching articles:", err);
      }
    };

    fetchArticles();
  }, []);

  // Fetch articles when query or filters change
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const params = new URLSearchParams();

        // Query
        if (debouncedQuery) {
          params.append("query", debouncedQuery);
        }

        // City
        if (filters.city) {
          const response = await fetch(`/api/city?slug=${filters.city}`);
          const data = await response.json();
          if (response.ok) params.append("city_id", data.id);
        }

        // Tags
        if (filters.tags.length) {
          params.append("primary_tags", filters.tags.join(","));

        }

        // Sort
        if (filters.sort) {
          type SortKey =
            | "A → Z (Alphabetical)"
            | "Z → A (Alphabetical)"
            | "Newest First"
            | "Oldest First";

          const sortOptions: Record<SortKey, string> = {
            "A → Z (Alphabetical)": "asc",
            "Z → A (Alphabetical)": "desc",
            "Newest First": "newest",
            "Oldest First": "oldest",
          };

          params.append(
            "sort",
            sortOptions[filters.sort as SortKey] || "date_desc"
          );
        }

        const response = await fetch(`/api/articles?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch articles");
        }

        setResults(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [debouncedQuery, filters]);

  return (
    <div className="max-w-screen-xl mx-auto py-8">
      {/* Page heading */}
      <img src="/logo.svg" className="h-20"></img>
      <h1 className="text-3xl font-bold mb-2">Discover Articles</h1>
      <p className="text-gray-600 mb-6">
        Explore guides, hidden gems, and more from around the world.
      </p>

      {/* Top controls (search & filters) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <SearchBar onQueryChange={setQuery} />
        <SearchDropdown onFiltersChange={setFilters} />
      </div>

      {/* Articles grid or no-results message */}
      {results.length === 0 ? (
        <p className="text-center text-gray-500">No articles found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {results.map((article, i) => (
            <ArticleCard key={i} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
