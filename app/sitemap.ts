import { MetadataRoute } from "next"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rehabpearls.com"

  const staticPaths = [
    "",
    "/about",
    "/pricing",
    "/qbank",
    "/guides",
    "/blog",
    "/cases",
    "/cases/neuro",
    "/cases/orthopedic",
    "/cases/pediatrics",
    "/support",
    "/faq",
  ]

  const staticPages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }))

  const supabaseUrl = process.env["NEXT_PUBLIC_SUPABASE_URL"]
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"]

  let blogPages: MetadataRoute.Sitemap = []

  if (supabaseUrl && serviceKey) {
    const supabase = createClient(supabaseUrl, serviceKey)

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at, created_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })

    blogPages =
      posts?.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(
          post.updated_at || post.published_at || post.created_at || new Date()
        ),
        changeFrequency: "weekly",
        priority: 0.85,
      })) || []
  }

  return [...staticPages, ...blogPages]
}