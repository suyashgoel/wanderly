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
    setValidImage(true); // Reset when article changes
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
    </Dialog>
  );
}
