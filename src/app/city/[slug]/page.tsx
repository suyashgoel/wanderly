import { ArticleCard } from "@/components/articleCard";
import { Article } from "@/types";
import { headers } from "next/headers";

export default async function CityPage({
  params,
}: {
  params: { slug: string };
}) {

  const slug = params.slug;

  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const city_res = await fetch(`${protocol}://${host}/api/city?slug=${slug}`);
  const city = await city_res.json();

  if (!city_res.ok) {
    return <div className="p-6 text-red-500">City not found.</div>;
  }

  const articles_res = await fetch(`${protocol}://${host}/api/articles?city_id=${city.id}`);
  const articles: Article[] = await articles_res.json();

  if (!articles_res.ok) {
    return <div className="p-6 text-red-500">Error fetching articles.</div>;
  }

  return (
    <div className="space-y-6">
      {city.image_url && (
        <img
          src={city.image_url}
          alt={city.name}
          className="w-full h-64 object-cover shadow"
        />
      )}
      <div className="p-6">
        <h1 className="text-4xl font-bold">{city.name}</h1>
        <p className="text-muted-foreground text-lg pt-2">{city.description}</p>
        <div className="mt-10 text-sm text-muted-foreground italic">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <ArticleCard key={i} article={article} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
