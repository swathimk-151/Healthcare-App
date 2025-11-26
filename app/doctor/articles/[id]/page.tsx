"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DoctorLayout } from "@/components/doctor-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Calendar, Edit } from "lucide-react"
import { useArticles } from "@/contexts/article-context"
import type { Article } from "@/contexts/article-context"

export default function ArticleViewPage() {
  const router = useRouter()
  const params = useParams()
  const { articles } = useArticles()
  const [article, setArticle] = useState<Article | null>(null)

  useEffect(() => {
    if (params.id) {
      const articleId = Array.isArray(params.id) ? params.id[0] : params.id
      const foundArticle = articles.find((a) => a.id === articleId)

      if (foundArticle) {
        setArticle(foundArticle)
      } else {
        router.push("/doctor/articles")
      }
    }
  }, [params.id, articles, router])

  if (!article) {
    return (
      <DoctorLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <p>Loading article...</p>
        </div>
      </DoctorLayout>
    )
  }

  return (
    <DoctorLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Article Preview</h1>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="relative w-full h-64">
              <img
                src={article.image || "/placeholder.svg?height=400&width=800"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge>{article.category}</Badge>
                {article.featured && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{article.readTime}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{article.date}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center"
                  onClick={() => router.push(`/doctor/articles/edit/${article.id}`)}
                >
                  <Edit className="mr-1 h-4 w-4" /> Edit
                </Button>
              </div>
              <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
              <p className="text-lg text-muted-foreground mb-6">{article.description}</p>
              <div className="prose max-w-none">
                {article.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Written by <span className="font-medium">{article.authorName}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  )
}
