"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FiMaximize2 } from "react-icons/fi";
import { Article } from "@/types";
import { useEffect, useState } from "react";

export function ArticleCard({ article }: { article: Article }) {
  const [validImage, setValidImage] = useState(true);

  useEffect(() => {
    setValidImage(true);
  }, [article.image_url]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative w-full max-w-sm h-64 overflow-hidden rounded-2xl shadow-lg transition transform hover:scale-105 cursor-pointer">
          <img
            src={validImage && article.image_url?.trim() ? article.image_url : "/fallback.svg"}
            alt="Article image"
            className="absolute inset-0 w-full h-full object-cover"
            onLoad={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.naturalWidth < 300 || img.naturalHeight < 200) {
                setValidImage(false); // Mark image as invalid if it's too small
              }
            }}
            onError={() => setValidImage(false)} // Handle broken image
          />
          <div className="absolute bottom-0 left-0 w-full flex justify-between items-center bg-gradient-to-t from-black/70 to-transparent text-white px-4 py-2">
            <p className="text-base font-bold truncate max-w-[85%] font-inter">
              {article.title}
            </p>
            <FiMaximize2 className="text-white" size="1.2rem" />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-lg p-6 rounded-2xl shadow-xl bg-white dark:bg-[#222529] transition-colors flex flex-col">
         <DialogHeader>
           <DialogTitle className="text-2xl font-bold font-inter text-[#0077FF] dark:text-[#7B61FF]">
             {article.title}
           </DialogTitle>
         </DialogHeader>
         <a
           href={article.url}
           target="_blank"
           rel="noopener noreferrer"
           className="text-sm font-inter underline font-medium text-[#0077FF] dark:text-[#FF7A00] mb-3 block break-words"
         >
           {article.url}
         </a>
         <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 font-light">
           {article.description}
         </p>
         <div className="flex flex-wrap gap-2">
           {article.tags.map((tag, i) => (
             <span
               key={i}
               className="text-xs font-semibold text-white px-2 py-1 rounded-full bg-gradient-to-r from-[#0077FF] to-[#7B61FF] shadow-md"
             >
               #{tag}
             </span>
           ))}
         </div>
       </DialogContent>
    </Dialog>
  );
}
