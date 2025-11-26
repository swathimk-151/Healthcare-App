export interface Article {
  id: string
  title: string
  summary: string
  content: string
  author: string
  category: string
  tags: string[]
  publishDate: string
  status: "published" | "draft" | "archived"
  featured: boolean
  image?: string
}

export const articles = [
  {
    id: 1,
    title: "Understanding Blood Pressure: What Your Numbers Mean",
    description:
      "Blood pressure is a vital sign that measures the force of blood pushing against the walls of your arteries. Learn what your blood pressure numbers mean and how to maintain healthy levels.",
    category: "Wellness",
    readTime: "5 min read",
    date: "May 15, 2023",
    image: "/placeholder.svg?height=200&width=400",
    authorName: "Dr. Rajesh Kumar",
    authorType: "doctor",
    featured: true,
  },
  {
    id: 2,
    title: "The Benefits of Mediterranean Diet for Heart Health",
    description:
      "The Mediterranean diet emphasizes eating primarily plant-based foods, such as fruits and vegetables, whole grains, legumes, and nuts. Research has shown it can reduce the risk of heart disease.",
    category: "Nutrition",
    readTime: "7 min read",
    date: "May 10, 2023",
    image: "/placeholder.svg?height=200&width=400",
    authorName: "Dr. Priya Sharma",
    authorType: "doctor",
    featured: true,
  },
  {
    id: 3,
    title: "Managing Stress Through Mindfulness Practices",
    description:
      "Chronic stress can have negative effects on both physical and mental health. Learn how mindfulness practices can help reduce stress and improve overall well-being.",
    category: "Mental Health",
    readTime: "6 min read",
    date: "May 8, 2023",
    image: "/placeholder.svg?height=200&width=400",
    authorName: "Ananya Desai",
    authorType: "therapist",
    featured: true,
  },
  {
    id: 4,
    title: "The Importance of Regular Exercise for Diabetes Management",
    description:
      "Regular physical activity is crucial for managing diabetes. It helps control blood sugar levels, reduces cardiovascular risk factors, and improves overall health.",
    category: "Fitness",
    readTime: "8 min read",
    date: "May 5, 2023",
    image: "/placeholder.svg?height=200&width=400",
    authorName: "Dr. Vikram Patel",
    authorType: "doctor",
  },
  {
    id: 5,
    title: "Understanding Vaccines: How They Work and Why They Matter",
    description:
      "Vaccines are one of the most effective tools for preventing infectious diseases. Learn about how vaccines work, their safety, and their importance for public health.",
    category: "Wellness",
    readTime: "10 min read",
    date: "May 3, 2023",
    image: "/placeholder.svg?height=200&width=400",
    authorName: "Dr. Meera Reddy",
    authorType: "doctor",
  },
  {
    id: 6,
    title: "The Role of Sleep in Immune Function",
    description:
      "Quality sleep is essential for a healthy immune system. Discover how sleep affects immune function and tips for improving your sleep habits.",
    category: "Wellness",
    readTime: "6 min read",
    date: "April 28, 2023",
    image: "/placeholder.svg?height=200&width=400",
    authorName: "Dr. Sanjay Gupta",
    authorType: "doctor",
  },
  {
    id: 7,
    title: "Nutrition for Brain Health: Foods That Boost Cognitive Function",
    description:
      "What you eat affects not just your physical health but also your brain function. Learn about foods that can help improve memory, focus, and overall cognitive health.",
    category: "Nutrition",
    readTime: "7 min read",
    date: "April 25, 2023",
    image: "/placeholder.svg?height=200&width=400",
    authorName: "Neha Joshi",
    authorType: "nutritionist",
  },
  {
    id: 8,
    title: "Understanding Anxiety Disorders: Symptoms and Treatment Options",
    description:
      "Anxiety disorders are the most common mental health conditions. Learn about different types of anxiety disorders, their symptoms, and effective treatment approaches.",
    category: "Mental Health",
    readTime: "9 min read",
    date: "April 20, 2023",
    image: "/placeholder.svg?height=200&width=400",
    authorName: "Dr. Kavita Menon",
    authorType: "doctor",
  },
  {
    id: 9,
    title: "The Benefits of Strength Training for All Ages",
    description:
      "Strength training isn't just for bodybuilders. It offers numerous health benefits for people of all ages, including improved bone density, metabolism, and functional fitness.",
    category: "Fitness",
    readTime: "6 min read",
    date: "April 18, 2023",
    image: "/placeholder.svg?height=200&width=400",
    authorName: "Rahul Verma",
    authorType: "fitness",
  },
  {
    id: 10,
    title: "Managing Chronic Pain: Integrative Approaches",
    description:
      "Chronic pain affects millions of people worldwide. Explore integrative approaches to pain management that combine conventional medicine with complementary therapies.",
    category: "Wellness",
    readTime: "8 min read",
    date: "April 15, 2023",
    image: "/placeholder.svg?height=200&width=400",
    authorName: "Dr. Arjun Nair",
    authorType: "doctor",
  },
]
