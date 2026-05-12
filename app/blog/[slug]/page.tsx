import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supabase = await createClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!post) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supabase = await createClient()

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!post) notFound()

  return (
    <main
      style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "70px 24px",
      }}
    >
      <article>
        <h1
          style={{
            fontSize: 56,
            lineHeight: 1.02,
            letterSpacing: "-0.06em",
            fontWeight: 850,
            marginBottom: 24,
          }}
        >
          {post.title}
        </h1>

        <p
          style={{
            fontSize: 20,
            color: "#94a3b8",
            lineHeight: 1.7,
            marginBottom: 42,
          }}
        >
          {post.excerpt}
        </p>

        <div
          style={{
            fontSize: 18,
            lineHeight: 1.95,
            color: "#e2e8f0",
          }}
          dangerouslySetInnerHTML={{
            __html: post.content
              .replace(/\n/g, "<br/><br/>")
              .replace(/## (.*?)(<br\/><br\/>|$)/g, "<h2>$1</h2>")
              .replace(/### (.*?)(<br\/><br\/>|$)/g, "<h3>$1</h3>"),
          }}
        />

        {post.keywords?.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 50,
            }}
          >
            {post.keywords.map((k: string) => (
              <span
                key={k}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "#12192B",
                  border: "1px solid #243041",
                  fontSize: 13,
                }}
              >
                {k}
              </span>
            ))}
          </div>
        )}
      </article>
    </main>
  )
}