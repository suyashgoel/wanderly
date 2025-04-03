import { useState } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

// Gradient tag component

export default function Tag({
  text,
  i,
  onClick,
}: {
  text: string;
  i: number;
  onClick: (i: number) => void;
}) {
  return (
    <div
      key={i}
      className="flex text-xs font-semibold text-white px-2 py-1.5 rounded-full bg-gradient-to-r from-[#0077FF] to-[#7B61FF] shadow-md"
    >
      {text}
      <button
        onClick={() => onClick(i)}
        className="ml-2 hover:opacity-80"
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
