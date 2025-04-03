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
  _description,
  _tags,
}: {
  _url?: string;
  _title?: string;
  _description?: string;
  _tags?: string[];
}) {
  const [url, setUrl] = useState(_url || "");
  const [title, setTitle] = useState(_title || "");
  const [description, setDescription] = useState(_description || "");
  const [tags, setTags] = useState(_tags || []);
  const [currTag, setCurrTag] = useState("");

  const handleSubmit = async () => {
    console.log("To do:");
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-500 text-white"
        >
          Open Article Dialog
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6 rounded-2xl shadow-xl bg-white dark:bg-[#222529] transition-colors">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-inter text-[#0077FF] dark:text-[#7B61FF]">
            Add Article
          </DialogTitle>
        </DialogHeader>

        <DialogClose
          asChild
          onClick={() => {
            setUrl("");
            setTitle("");
            setDescription("");
            setTags([]);
            setCurrTag("");
          }}
        >
          <button
            className="absolute top-4 right-4 rounded-sm p-1 opacity-70 transition-opacity hover:opacity-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogClose>

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

        <div className="flex flex-wrap gap-2 mt-2">
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
          rows={1}
          className="mt-4 w-full resize-none overflow-hidden rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-[#222529] dark:text-white"
        />

        <Button
          className="mt-6 w-full bg-gradient-to-tr from-[#0077FF] to-[#7B61FF] text-white font-semibold"
          onClick={handleSubmit}
        >
          Post
        </Button>
      </DialogContent>
    </Dialog>
  );
}
