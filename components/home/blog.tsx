import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface BlogPost {
  title: string
  category: string
  author: {
    name: string
    avatar: string
  }
  date: string
  image: string
}

const blogPosts: BlogPost[] = [
  {
    title: "Building Secure Authentication Systems",
    category: "Security",
    author: {
      name: "John Doe",
      avatar: "/avatars/john-doe.png"
    },
    date: "Feb 10, 2024",
    image: "/blog/auth-security.jpg"
  },
  {
    title: "The Future of Password-less Authentication",
    category: "Technology",
    author: {
      name: "Jane Smith",
      avatar: "/avatars/jane-smith.png"
    },
    date: "Feb 8, 2024",
    image: "/blog/passwordless.jpg"
  },
  {
    title: "Implementing Two-Factor Authentication",
    category: "Tutorial",
    author: {
      name: "Mike Johnson",
      avatar: "/avatars/mike-johnson.png"
    },
    date: "Feb 5, 2024",
    image: "/blog/2fa-guide.jpg"
  },
]

interface BlogProps {
  className?: string
}

export function Blog({ className }: BlogProps) {
  return (
    <section className={cn("py-24", className)}>
      <div className="container px-4 max-w-screen-xl mx-auto">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-black tracking-tight">Latest Posts</h2>
          <Select defaultValue="recommended">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post, i) => (
            <Card key={i} className="shadow-none">
              <CardHeader className="p-2">
                <div className="aspect-video bg-muted rounded-lg w-full" />
              </CardHeader>
              <CardContent className="pt-4 pb-5">
                <Badge>{post.category}</Badge>

                <h3 className="mt-4 text-2xl font-bold tracking-tight">
                  {post.title}
                </h3>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                    <span className="text-muted-foreground font-semibold">
                      {post.author.name}
                    </span>
                  </div>

                  <span className="text-muted-foreground text-sm">
                    {post.date}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}