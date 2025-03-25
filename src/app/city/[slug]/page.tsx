import { createClient } from "@/utils/supabase/server";

type City = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
};

export default async function CityPage(promise: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await promise.params; // ✅ unwrap the slug here

  const supabase = await createClient();

  const { data: city, error: cityError } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", slug)
    .single();

  if (cityError || !city) {
    return <div className="p-6 text-red-500">City not found.</div>;
  }


  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select("*")
    .eq("city_id", city.id);
  
    if (articlesError) {
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
        <p className="text-muted-foreground text-lg">{city.description}</p>
        <div className="mt-10 text-sm text-muted-foreground italic">
          Articles coming soon...
        </div>
      </div>
    </div>
  );
}
