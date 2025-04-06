"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Tag from "@/components/tagInput";
import { X } from "lucide-react";

export function SubmitArticleCard({
  _url,
  _title,
  _image,
  _tags,
  _description,
  _city_id,
  onClose
}: {
  _url?: string;
  _title?: string;
  _image?: string;
  _tags?: string[];
  _description?: string;
  _city_id: string;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(_url || "");
  const [title, setTitle] = useState(_title || "");
  const [description, setDescription] = useState(_description || "");
  const [tags, setTags] = useState(_tags || []);
  const [currTag, setCurrTag] = useState("");

  const image = _image || "";
  const city_id = _city_id;

  const handleSubmit = async () => {
    if (!title || !url || !description || tags.length === 0 || !city_id) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      const queryParams = new URLSearchParams({
        url,
        title,
        image_url: image,
        description,
        city_id,
        user_id: "219bdad1-763e-4d11-a584-eafadefcb30d", 
        tags: tags.join(","),
      });
  
      const res = await fetch(`/api/submit?${queryParams.toString()}`, {
        method: "POST",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error("Error posting article:", data.error || data);
        alert("Something went wrong!");
        return;
      }
  
      console.log("Article posted!", data);

      onClose();

      alert("Article submitted successfully!");
  
      setUrl("");
      setTitle("");
      setDescription("");
      setTags([]);
      setCurrTag("");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error submitting article.");
    }
  };
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currTag.trim() !== "") {
      e.preventDefault();
      setTags((prev) => [...prev, currTag.trim()]);
      setCurrTag("");
    }
  };

  const handleClick = (i: number) => {
    setTags((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <DialogContent className="w-full max-w-md h-[600px] p-4 rounded-2xl shadow-xl bg-white dark:bg-[#222529] transition-colors">
      <div className="flex flex-col gap-2 p-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-inter text-[#0077FF] dark:text-[#7B61FF]">
            Add Article
          </DialogTitle>
          <DialogClose asChild>
            <button
              className="absolute top-4 right-4 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
        </DialogHeader>

        <Label
          htmlFor="title"
          className="text-md font-inter text-[#0077FF] dark:text-[#7B61FF]"
        >
          Title
        </Label>
        <Input
          id="title"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-inter"
        />

        <Label
          htmlFor="url"
          className="text-md font-inter text-[#0077FF] dark:text-[#7B61FF]"
        >
          URL
        </Label>
        <Input
          id="url"
          placeholder="Enter Url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <Label
          htmlFor="tags"
          className="text-md font-inter text-[#0077FF] dark:text-[#7B61FF]"
        >
          Tags
        </Label>
        <Input
          id="tags"
          placeholder="Add Tags"
          value={currTag}
          onChange={(e) => setCurrTag(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Tag key={i} text={tag} i={i} onClick={handleClick} />
          ))}
        </div>

        <Label
          htmlFor="description"
          className="text-md font-inter text-[#0077FF] dark:text-[#7B61FF]"
        >
          Description
        </Label>
        <textarea
          id="description"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          rows={4}
          className="w-full resize-none overflow-auto rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-[#222529] dark:text-white"
        />

        <Button
          className="mt-6 w-full bg-gradient-to-tr from-[#0077FF] to-[#7B61FF] text-white font-semibold"
          onClick={handleSubmit}
        >
          Post
        </Button>
      </div>
    </DialogContent>
  );
}
