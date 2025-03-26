import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  
  import { FiMaximize2 } from "react-icons/fi";
  
  export function CityCard({
    article,
  }: {
    article: {
      title: string;
      preview_image_url: string;
      url: string;
      description: string;
      tags: string[];
    };
  }) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <div className="relative w-full max-w-sm h-64 overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
              <img
                src={article.preview_image_url}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full flex justify-between items-center bg-gradient-to-t from-black/70 to-transparent text-white px-4 py-2">
                <p className="text-sm font-semibold truncate max-w-[85%]">
                  {article.title}
                </p>
                <FiMaximize2 className="text-white" size="1rem" />
              </div>
            </div>
          </div>
        </DialogTrigger>
  
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>{article.title}</DialogTitle>
          </DialogHeader>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-sm mb-3 block"
          >
            {article.url}
          </a>
          <p className="text-sm text-muted-foreground mb-4">
            {article.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-200 text-xs text-gray-800 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  