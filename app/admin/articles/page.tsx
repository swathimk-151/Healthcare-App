"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Clock, Eye, User, UserCheck, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useArticles } from "@/contexts/article-context"
import { toast } from "@/components/ui/use-toast"

export default function AdminArticlesPage() {
  const router = useRouter()
  const { articles, deleteArticle } = useArticles()
  const [searchTerm, setSearchTerm] = useState("")
  const [authorFilter, setAuthorFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Get unique categories
  const categories = ["all", ...new Set(articles.map((article) => article.category))]

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchTerm === "" ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.authorName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAuthor = authorFilter === "all" || article.authorType === authorFilter
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter

    return matchesSearch && matchesAuthor && matchesCategory
  })

  const handleDeleteArticle = (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      deleteArticle(id)
      toast({
        title: "Article Deleted",
        description: "The article has been successfully deleted.",
      })
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Articles</h1>
            <p className="text-gray-500 mt-2">Create and manage health articles for patients</p>
          </div>
          <Button
            onClick={() => router.push("/admin/articles/create")}
            className="bg-healthcare-purple hover:bg-healthcare-purple/90"
          >
            <Plus className="mr-2 h-4 w-4" /> New Article
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Filter:</span>
          </div>

          <Select value={authorFilter} onValueChange={setAuthorFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Author Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredArticles.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">No articles found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setAuthorFilter("all")
                  setCategoryFilter("all")
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id}>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover rounded-l-lg"
                    />
                  </div>
                  <div className="md:w-3/4 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge>{article.category}</Badge>
                        {article.featured && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm">
                        {article.authorType === "doctor" ? (
                          <UserCheck className="h-4 w-4 mr-1 text-healthcare-green" />
                        ) : (
                          <User className="h-4 w-4 mr-1 text-healthcare-purple" />
                        )}
                        <span
                          className={
                            article.authorType === "doctor" ? "text-healthcare-green" : "text-healthcare-purple"
                          }
                        >
                          {article.authorName}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-medium text-xl mb-2">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{article.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{article.readTime}</span>
                      <span className="mx-2">•</span>
                      <span>{article.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center"
                        onClick={() => router.push(`/admin/articles/${article.id}`)}
                      >
                        <Eye className="mr-1 h-4 w-4" /> Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center"
                        onClick={() => router.push(`/admin/articles/edit/${article.id}`)}
                      >
                        <Edit className="mr-1 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
