"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { useArticles } from "@/contexts/article-context"

export default function CreateArticlePage() {
  const router = useRouter()
  const { addArticle } = useArticles()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    readTime: "",
    image: "/placeholder.svg?height=200&width=400",
    featured: false,
  })

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
      // Get admin info from localStorage
      const adminUserStr = localStorage.getItem("adminUser")
      if (!adminUserStr) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in as an admin to create articles.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      const adminUser = JSON.parse(adminUserStr)

      // Add the article
      addArticle({
        ...formData,
        authorId: adminUser.id,
        authorName: adminUser.name || "Healthcare Admin",
        authorType: "admin",
      })

      toast({
        title: "Article Created",
        description: "Your article has been published successfully.",
      })

      // Redirect to articles list
      router.push("/admin/articles")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Article</h1>
          <p className="text-gray-500 mt-2">Publish a new health article for patients</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
              <CardDescription>Fill in the information for the new article</CardDescription>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish Article"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AdminLayout>
  )
}
