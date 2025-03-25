import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FiMaximize2 } from "react-icons/fi";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ArticleCard({
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
    <Card className="relative w-full max-w-sm h-64 overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
      <img
        src={article.preview_image_url}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <CardContent className="absolute bottom-0 left-0 w-full flex justify-between items-center bg-gradient-to-t from-black/70 to-transparent text-white px-4 py-2">
        <p className="text-sm font-semibold truncate max-w-[85%]">
          {article.title}
        </p>
        <FiMaximize2 className="text-white" size="1rem" />
      </CardContent>
    </Card>
    /*
    <Card className="relative w-full max-w-sm overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition">
      <CardContent className="p-0">
        <img
          src={article.preview_image_url}
          alt=""
          className="w-full h-48 object-cover"
        />
      </CardContent>
      <CardFooter className="p-4 flex flex-row justify-between">
        <p className="text-sm font-semibold">{article.title}</p>
        <FiMaximize2 size="1.2em" className="text-black" />
      </CardFooter>
    </Card>
    */
  );
}
