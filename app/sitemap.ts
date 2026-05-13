import { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rehabpearls.com"
  const supabase = await createClient()

  const staticPages: MetadataRoute.Sitemap = [
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
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }))

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, published_at, created_at")
    .eq("status", "published")

  const blogPages: MetadataRoute.Sitemap =
    posts?.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(
        post.updated_at || post.published_at || post.created_at || new Date()
      ),
      changeFrequency: "weekly",
      priority: 0.75,
    })) || []

  return [...staticPages, ...blogPages]
}