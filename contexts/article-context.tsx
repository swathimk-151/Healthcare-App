"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the Article type
export interface Article {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  authorType: "doctor" | "admin"
  createdAt: string
  updatedAt: string
  status: "draft" | "published"
  category: string
  tags: string[]
  imageUrl?: string
}

// Define the context type
interface ArticleContextType {
  articles: Article[]
  getArticleById: (id: string) => Article | undefined
  addArticle: (article: Omit<Article, "id" | "createdAt" | "updatedAt">) => void
  updateArticle: (id: string, article: Partial<Article>) => void
  deleteArticle: (id: string) => void
  loading: boolean
}

// Create the context
const ArticleContext = createContext<ArticleContextType | undefined>(undefined)

// Sample data
const sampleArticles: Article[] = [
  {
    id: "1",
    title: "Understanding Diabetes: Symptoms, Causes, and Management",
    content:
      "Diabetes is a chronic condition that affects how your body turns food into energy. Learn about the symptoms, causes, and how to manage diabetes effectively.",
    authorId: "doctor-1",
    authorName: "Dr. Sarah Johnson",
    authorType: "doctor",
    createdAt: new Date(2023, 5, 15).toISOString(),
    updatedAt: new Date(2023, 5, 15).toISOString(),
    status: "published",
    category: "Chronic Conditions",
    tags: ["diabetes", "health", "chronic disease"],
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    title: "The Importance of Regular Exercise for Heart Health",
    content:
      "Regular physical activity is one of the best things you can do for your heart. This article explores how exercise benefits your cardiovascular system and provides tips for starting a heart-healthy exercise routine.",
    authorId: "doctor-1",
    authorName: "Dr. Sarah Johnson",
    authorType: "doctor",
    createdAt: new Date(2023, 6, 22).toISOString(),
    updatedAt: new Date(2023, 6, 22).toISOString(),
    status: "published",
    category: "Cardiovascular Health",
    tags: ["exercise", "heart health", "fitness"],
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    title: "Mental Health During the Pandemic: Coping Strategies",
    content:
      "The COVID-19 pandemic has had a significant impact on mental health worldwide. This article discusses effective coping strategies and when to seek professional help.",
    authorId: "admin-1",
    authorName: "Admin User",
    authorType: "admin",
    createdAt: new Date(2023, 7, 5).toISOString(),
    updatedAt: new Date(2023, 7, 5).toISOString(),
    status: "published",
    category: "Mental Health",
    tags: ["mental health", "pandemic", "coping strategies"],
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "4",
    title: "Nutrition Basics: Building a Balanced Diet",
    content:
      "A balanced diet is essential for good health. Learn about the different food groups, portion sizes, and how to create nutritious meals for you and your family.",
    authorId: "doctor-1",
    authorName: "Dr. Sarah Johnson",
    authorType: "doctor",
    createdAt: new Date(2023, 8, 10).toISOString(),
    updatedAt: new Date(2023, 8, 10).toISOString(),
    status: "draft",
    category: "Nutrition",
    tags: ["nutrition", "diet", "healthy eating"],
    imageUrl: "/placeholder.svg?height=200&width=400",
  },
]

// Create the provider component
export function ArticleProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch articles from an API
    // For now, we'll use the sample data
    const fetchArticles = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setArticles(sampleArticles)
      } catch (error) {
        console.error("Error fetching articles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const getArticleById = (id: string) => {
    return articles.find((article) => article.id === id)
  }

  const addArticle = (article: Omit<Article, "id" | "createdAt" | "updatedAt">) => {
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setArticles((prevArticles) => [...prevArticles, newArticle])
  }

  const updateArticle = (id: string, updatedFields: Partial<Article>) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === id
          ? {
              ...article,
              ...updatedFields,
              updatedAt: new Date().toISOString(),
            }
          : article,
      ),
    )
  }

  const deleteArticle = (id: string) => {
    setArticles((prevArticles) => prevArticles.filter((article) => article.id !== id))
  }

  const value = {
    articles,
    getArticleById,
    addArticle,
    updateArticle,
    deleteArticle,
    loading,
  }

  return <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>
}

// Create a custom hook to use the context
export function useArticles() {
  const context = useContext(ArticleContext)
  if (context === undefined) {
    throw new Error("useArticles must be used within an ArticleProvider")
  }
  return context
}
