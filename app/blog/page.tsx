import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Rehab Blog | RehabPearls",
  description:
    "Evidence-based rehab education, clinical reasoning, therapy news, PT, OT, SLP learning resources and rehabilitation insights.",
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
      <h1
        style={{
          fontSize: 52,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          marginBottom: 16,
        }}
      >
        Rehab Blog
      </h1>

      <p
        style={{
          fontSize: 18,
          color: "#94a3b8",
          marginBottom: 42,
          lineHeight: 1.7,
          maxWidth: 700,
        }}
      >
        Clinical rehabilitation insights, therapy education, PT, OT, SLP learning,
        evidence-based rehab strategies, and board-style educational content.
      </p>

      <div
        style={{
          display: "grid",
          gap: 20,
        }}
      >
        {posts?.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <article
              style={{
                background: "#12192B",
                border: "1px solid #243041",
                borderRadius: 20,
                padding: 28,
              }}
            >
              <h2
                style={{
                  fontSize: 30,
                  fontWeight: 750,
                  marginBottom: 14,
                  lineHeight: 1.15,
                }}
              >
                {post.title}
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  lineHeight: 1.8,
                  fontSize: 16,
                }}
              >
                {post.excerpt}
              </p>

              <div
                style={{
                  marginTop: 18,
                  color: "#818cf8",
                  fontWeight: 700,
                }}
              >
                Read article →
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  )
}