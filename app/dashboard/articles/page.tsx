"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, Heart, Share2, BookmarkPlus, User, UserCheck } from "lucide-react"
import Link from "next/link"
import { articles } from "@/data/articles"

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [filteredArticles, setFilteredArticles] = useState(articles)

  // Set isClient to true once the component is mounted
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Filter articles based on search term
  useEffect(() => {
    if (isClient) {
      const filtered = searchTerm
        ? articles.filter(
            (article) =>
              article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
              article.authorName.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : articles
      setFilteredArticles(filtered)
    }
  }, [searchTerm, isClient])

  // Get featured articles
  const featuredArticles = articles.filter((article) => article.featured)

  // Get articles by category
  const getArticlesByCategory = (category: string) => {
    return articles.filter((article) => article.category.toLowerCase() === category.toLowerCase())
  }

  if (!isClient) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Articles</h1>
          <p className="text-gray-500 mt-2">
            Stay informed with the latest health information from our doctors and healthcare experts
          </p>
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
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Articles</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
            <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {searchTerm ? (
              <>
                <h2 className="text-2xl font-bold">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => <ArticleCard key={article.id} {...article} />)
                  ) : (
                    <p className="col-span-2 text-center py-8 text-gray-500">No articles found matching your search.</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredArticles.slice(0, 3).map((article) => (
                    <FeaturedArticleCard key={article.id} {...article} />
                  ))}
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">Recent Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.slice(0, 6).map((article) => (
                    <ArticleCard key={article.id} {...article} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {["wellness", "nutrition", "fitness", "mental-health"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getArticlesByCategory(category).length > 0 ? (
                  getArticlesByCategory(category).map((article) => <ArticleCard key={article.id} {...article} />)
                ) : (
                  <p className="col-span-2 text-center py-8 text-gray-500">No articles found in this category.</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function FeaturedArticleCard(article: any) {
  const { title, description, category, readTime, date, image, authorName, authorType } = article

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
        <Badge className="absolute top-3 left-3">{category}</Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base line-clamp-3">{description}</CardDescription>
        <div className="flex items-center mt-4 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{readTime}</span>
          <span className="mx-2">•</span>
          <span>{date}</span>
        </div>
        <div className="flex items-center mt-2 text-sm">
          {authorType === "doctor" ? (
            <UserCheck className="h-4 w-4 mr-1 text-healthcare-green" />
          ) : (
            <User className="h-4 w-4 mr-1 text-healthcare-purple" />
          )}
          <span className={authorType === "doctor" ? "text-healthcare-green" : "text-healthcare-purple"}>
            {authorName}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="link" className="px-0" asChild>
          <Link href="#">Read more</Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Like</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <BookmarkPlus className="h-4 w-4" />
            <span className="sr-only">Save</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function ArticleCard(article: any) {
  const { title, description, category, readTime, date, image, authorName, authorType } = article

  return (
    <Card>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover rounded-l-lg" />
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between items-start mb-2">
            <Badge>{category}</Badge>
            <div className="flex items-center text-sm">
              {authorType === "doctor" ? (
                <UserCheck className="h-4 w-4 mr-1 text-healthcare-green" />
              ) : (
                <User className="h-4 w-4 mr-1 text-healthcare-purple" />
              )}
              <span className={authorType === "doctor" ? "text-healthcare-green" : "text-healthcare-purple"}>
                {authorName}
              </span>
            </div>
          </div>
          <h3 className="font-medium text-lg mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{readTime}</span>
              <span className="mx-2">•</span>
              <span>{date}</span>
            </div>
            <Button variant="link" size="sm" className="px-0" asChild>
              <Link href="#">Read more</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
