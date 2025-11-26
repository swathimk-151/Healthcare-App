"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DoctorLayout } from "@/components/doctor-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { useArticles } from "@/contexts/article-context"
import type { Article } from "@/contexts/article-context"

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const { articles, updateArticle } = useArticles()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [article, setArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    readTime: "",
    image: "",
    featured: false,
  })

  useEffect(() => {
    if (params.id) {
      const articleId = Array.isArray(params.id) ? params.id[0] : params.id
      const foundArticle = articles.find((a) => a.id === articleId)

      if (foundArticle) {
        setArticle(foundArticle)
        setFormData({
          title: foundArticle.title,
          description: foundArticle.description,
          content: foundArticle.content,
          category: foundArticle.category,
          readTime: foundArticle.readTime,
          image: foundArticle.image,
          featured: foundArticle.featured || false,
        })
      } else {
        toast({
          title: "Article not found",
          description: "The article you're trying to edit could not be found.",
          variant: "destructive",
        })
        router.push("/doctor/articles")
      }
    }
  }, [params.id, articles, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!article) {
        toast({
          title: "Error",
          description: "Article not found",
          variant: "destructive",
        })
        return
      }

      // Update the article
      updateArticle(article.id, formData)

      toast({
        title: "Article Updated",
        description: "Your article has been updated successfully.",
      })

      // Redirect to articles list
      router.push("/doctor/articles")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
          <p className="text-gray-500 mt-2">Update your medical article</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
              <CardDescription>Update the information for your article</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter article title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the article (shown in previews)"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Article Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Full article content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  className="min-h-[200px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wellness">Wellness</SelectItem>
                      <SelectItem value="Nutrition">Nutrition</SelectItem>
                      <SelectItem value="Fitness">Fitness</SelectItem>
                      <SelectItem value="Mental Health">Mental Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    placeholder="e.g. 5 min read"
                    value={formData.readTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  placeholder="Image URL for the article"
                  value={formData.image}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">Leave as is to use a placeholder image</p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
                />
                <Label htmlFor="featured">Feature this article on the homepage</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-healthcare-green hover:bg-healthcare-green/90"
              >
                {isSubmitting ? "Updating..." : "Update Article"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DoctorLayout>
  )
}
