import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { useEffect } from "react";

const sortOptions = [
  "A → Z (Alphabetical)",
  "Z → A (Alphabetical)",
  "Newest First",
  "Oldest First",
];

export function SearchDropdown({
  onFiltersChange,
}: {
  onFiltersChange: (filters: {
    tags: string[];
    city: string | null;
    sort: string | null;
  }) => void;
}) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/tags");
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch tags");
        setTags(
          data.map(
            (tag: { name: string }) =>
              tag.name[0].toUpperCase() + tag.name.substring(1)
          )
        );
      } catch (err) {
        setTags([]);
      }
    }

    async function fetchCities() {
      try {
        const response = await fetch("/api/cities");
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch cities");
        setCities(data.map((city: { name: string, slug:string }) => [city.name, city.slug]));
      } catch (err) {
        setCities([]);
      }
    }

    fetchTags();
    fetchCities();
  }, []);

  // Function to update filters in the parent
  useEffect(() => {
    onFiltersChange({
      tags: selectedTags,
      city: selectedCity,
      sort: selectedSort,
    });
  }, [selectedTags, selectedCity, selectedSort, onFiltersChange]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Filters <ChevronDown className="ml-2 w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60">
        {/* TAGS */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Tags</DropdownMenuLabel>
          {tags.map((tag) => (
            <DropdownMenuItem key={tag} onClick={() => toggleTag(tag)}>
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                }`}
              />
              {tag}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        {/* CITIES */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Cities</DropdownMenuLabel>
          {cities.map((city) => (
            <DropdownMenuItem key={city[1]} onClick={() => setSelectedCity(city[1])}>
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedCity === city[1] ? "opacity-100" : "opacity-0"
                }`}
              />
              {city[0]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        {/* SORT BY */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          {sortOptions.map((sort) => (
            <DropdownMenuItem key={sort} onClick={() => setSelectedSort(sort)}>
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedSort === sort ? "opacity-100" : "opacity-0"
                }`}
              />
              {sort}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
