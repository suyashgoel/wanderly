"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CityPage({ params }: { params: { slug: string } }) {
  const [city, setCity] = useState<any>(null)
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const { data: cityData } = await supabase
        .from("cities")
        .select("*")
        .eq("slug", params.slug)
        .single()

      setCity(cityData)

      if (cityData?.id) {
        const { data: articlesData } = await supabase
          .from("articles")
          .select("*")
          .eq("city_id", cityData.id)

        setArticles(articlesData || [])
      }
    }

    fetchData()
  }, [params.slug])
if (!city) return <div>Loading...</div>

return (
  <div className="space-y-8">
    {/* City Banner Image */}
    {city.image_url && (
      <img
        src={city.image_url}
        alt={city.name}
        className="w-full h-64 object-cover rounded-xl shadow"
      />
    )}

    {/* City Name + Description */}
    <div>
      <h1 className="text-4xl font-bold mb-2">{city.name}</h1>
      <p className="text-muted-foreground">{city.description}</p>
    </div>

    {/* Article List */}
    <div className="space-y-6">
      {articles.map((article) => (
        <Card key={article.id}>
          <CardHeader>
            <CardTitle>{article.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">{article.description}</p>
            <div className="flex gap-2 flex-wrap">
              {article.tags.map((tag: string) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)
}
