"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export function AutofillCard() {
  const [url, setUrl] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);

  const handleSubmit = async () => {
    if (!url || !city) return;
    
    const response = await fetch(`/api/autofill?url=${url}&city_id=${city}`); // Send url and city slug to autofill route
    console.log(response);
  };

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch("/api/cities");
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch cities");
        setCities(
          data.map((city: { id: string, name: string; slug: string}) => [
            city.id,
            city.name,
            city.slug,
          ])
        );
      } catch (err) {
        setCities([]);
      }
    }

    fetchCities();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="w-14 h-14 p-0 rounded-full bg-gradient-to-tr from-[#0077FF] to-[#7B61FF] text-white shadow-lg hover:scale-105 transition-transform"
        >
          <Plus size={24} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-6 rounded-2xl shadow-xl bg-white dark:bg-[#222529] transition-colors">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-inter text-[#0077FF] dark:text-[#7B61FF]">
            Add an Article
          </DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Paste article URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-4"
        />

        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="mt-4">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent side="bottom" sideOffset={4} position="popper" avoidCollisions={false}>
            {cities.map((city) => (
              <SelectItem key={city[2]} value={city[0]}>
                {city[1]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="mt-6 w-full bg-gradient-to-tr from-[#0077FF] to-[#7B61FF] text-white font-semibold"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}
