"use client";

import { ArticleCard } from "@/components/articleCard";
import { Input } from "@/components/ui/input";
import { Article } from "@/types";
import { useState, useEffect } from "react";
import { SearchDropdown } from "@/components/searchDropdown";

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch articles");
        }

        setResults(data);
      } catch (err: any) {}
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const params = new URLSearchParams();

        if (debouncedQuery) params.append("query", debouncedQuery);
        if (filters.city) {
          const response = await fetch(`/api/city?slug=${filters.city}`);
          const data = await response.json();
          if (response.ok) params.append("city_id", data.id);
        }

        if (filters.tags.length)
          params.append("primary_tags", filters.tags.join(","));
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

        if (!response.ok)
          throw new Error(data.error || "Failed to fetch articles");

        setResults(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [query, filters]);

  return (
    <div className="space-y-6">
      <div className="p-6">
        <div className="flex justify-between">
          <Input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchDropdown onFiltersChange={setFilters} />
        </div>
        <div className="mt-10 text-sm text-muted-foreground italic">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.map((result, i) => (
                <ArticleCard key={i} article={result} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
