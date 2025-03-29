import { useState, useEffect } from "react";
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
        setCities(
          data.map((city: { name: string; slug: string }) => [
            city.name,
            city.slug,
          ])
        );
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
        <Button className="flex items-center justify-between px-4 py-2 rounded-full border border-transparent bg-gradient-to-r from-[#0077FF] to-[#7B61FF] text-white shadow-lg hover:shadow-xl transition-all duration-200">
          Filters <ChevronDown className="ml-2 w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 rounded-2xl shadow-2xl p-4 bg-white dark:bg-[#222529]">
        {/* TAGS */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sm font-bold font-inter text-[#0077FF] dark:text-[#7B61FF] mb-2">
            Tags
          </DropdownMenuLabel>
          {tags.map((tag) => (
            <DropdownMenuItem
              key={tag}
              onClick={() => toggleTag(tag)}
              className="flex items-center px-3 py-2 rounded-lg transition-all duration-150 hover:bg-[#F4E8D4] dark:hover:bg-gray-700"
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedTags.includes(tag)
                    ? "opacity-100 text-transparent bg-clip-text bg-gradient-to-r from-[#0077FF] to-[#7B61FF]"
                    : "opacity-0"
                }`}
              />
              {tag}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        {/* CITIES */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sm font-bold font-inter text-[#0077FF] dark:text-[#7B61FF] mt-4 mb-2">
            Cities
          </DropdownMenuLabel>
          {cities.map((city) => (
            <DropdownMenuItem
              key={city[1]}
              onClick={() => {
                if (selectedCity != city[1]){
                    setSelectedCity(city[1]);
                }
                else{
                    setSelectedCity("");
                }
              }}
              className="flex items-center px-3 py-2 rounded-lg transition-all duration-150 hover:bg-[#F4E8D4] dark:hover:bg-gray-700"
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedCity === city[1]
                    ? "opacity-100  bg-clip-text bg-gradient-to-r from-[#0077FF] to-[#7B61FF]"
                    : "opacity-0"
                }`}
              />
              {city[0]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        {/* SORT BY */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sm font-bold font-inter text-[#0077FF] dark:text-[#7B61FF] mt-4 mb-2">
            Sort By
          </DropdownMenuLabel>
          {sortOptions.map((sort) => (
            <DropdownMenuItem
              key={sort}
              onClick={() => setSelectedSort(sort)}
              className="flex items-center px-3 py-2 rounded-lg transition-all duration-150 hover:bg-[#F4E8D4] dark:hover:bg-gray-700"
            >
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedSort === sort
                    ? "opacity-100 bg-clip-text bg-gradient-to-r from-[#0077FF] to-[#7B61FF]"
                    : "opacity-0"
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
