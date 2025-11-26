"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DoctorLayout } from "@/components/doctor-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useArticles } from "@/contexts/article-context"
import { formatDistanceToNow } from "date-fns"
import { Edit, Plus, Search, Trash2 } from "lucide-react"

export default function DoctorArticlesPage() {
  const { articles, deleteArticle } = useArticles()
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      deleteArticle(id)
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted.",
      })
    }
  }

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const myArticles = filteredArticles.filter((article) => article.authorType === "doctor")
  const publishedArticles = myArticles.filter((article) => article.status === "published")
  const draftArticles = myArticles.filter((article) => article.status === "draft")

  return (
    <DoctorLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Articles</h1>
          <Button onClick={() => router.push("/doctor/articles/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Articles ({myArticles.length})</TabsTrigger>
            <TabsTrigger value="published">Published ({publishedArticles.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({draftArticles.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myArticles.length > 0 ? (
              myArticles.map((article) => <ArticleCard key={article.id} article={article} onDelete={handleDelete} />)
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No articles found. Create your first article!</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="published" className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publishedArticles.length > 0 ? (
              publishedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} onDelete={handleDelete} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No published articles found.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="drafts" className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {draftArticles.length > 0 ? (
              draftArticles.map((article) => <ArticleCard key={article.id} article={article} onDelete={handleDelete} />)
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No draft articles found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DoctorLayout>
  )
}

function ArticleCard({ article, onDelete }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        <CardDescription>
          {article.status === "published" ? "Published" : "Draft"} •{" "}
          {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">{article.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/doctor/articles/${article.id}`}>View</Link>
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/doctor/articles/edit/${article.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" onClick={() => onDelete(article.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
