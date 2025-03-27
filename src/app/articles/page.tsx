"use client";

import { createClient } from "@/utils/supabase/client";
import { ArticleCard } from "@/components/articleCard";
import { Input } from "@/components/ui/input";
import { generateEmbeddings } from "@/lib/generateEmbeddings";

import { Article } from "@/types";

import { useState, useEffect } from "react";

export default function ArticlesPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);

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
      }
    };

    fetchArticles();
  }, []);

  console.log(results);

  return (
    <div className="space-y-6">
      <div className="p-6">
        <Input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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
