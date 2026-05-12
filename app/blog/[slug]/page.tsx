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
      title: "Article Not Found | RehabPearls",
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    alternates: {
      canonical: `https://rehabpearls.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `https://rehabpearls.com/blog/${post.slug}`,
      siteName: "RehabPearls",
      type: "article",
    },
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    url: `https://rehabpearls.com/blog/${post.slug}`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    author: {
      "@type": "Organization",
      name: "RehabPearls",
      url: "https://rehabpearls.com",
    },
    publisher: {
      "@type": "Organization",
      name: "RehabPearls",
      url: "https://rehabpearls.com",
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://rehabpearls.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://rehabpearls.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://rehabpearls.com/blog/${post.slug}`,
      },
    ],
  }

  const contentHtml = String(post.content || "")
    .replace(/\n/g, "<br/><br/>")
    .replace(/## (.*?)(<br\/><br\/>|$)/g, "<h2>$1</h2>")
    .replace(/### (.*?)(<br\/><br\/>|$)/g, "<h3>$1</h3>")

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(99,102,241,.12), transparent 34%), #0B1020",
        color: "#F8FAFC",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "72px 24px 90px",
        }}
      >
        <a
          href="/blog"
          style={{
            display: "inline-flex",
            color: "#93C5FD",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          ← Back to Blog
        </a>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 13px",
            borderRadius: 999,
            background: "rgba(99,102,241,.14)",
            border: "1px solid rgba(99,102,241,.26)",
            color: "#C7D2FE",
            fontSize: 13,
            fontWeight: 750,
            marginBottom: 22,
          }}
        >
          Rehab Education Article
        </div>

        <h1
          style={{
            fontSize: "clamp(38px, 6vw, 64px)",
            lineHeight: 1.02,
            letterSpacing: "-0.06em",
            fontWeight: 850,
            marginBottom: 22,
          }}
        >
          {post.title}
        </h1>

        {post.excerpt && (
          <p
            style={{
              fontSize: 20,
              color: "#CBD5E1",
              lineHeight: 1.75,
              marginBottom: 34,
              maxWidth: 780,
            }}
          >
            {post.excerpt}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 42,
          }}
        >
          <span
            style={{
              padding: "7px 11px",
              borderRadius: 999,
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.08)",
              color: "#94A3B8",
              fontSize: 13,
              fontWeight: 650,
            }}
          >
            Evidence-Based Rehab
          </span>

          <span
            style={{
              padding: "7px 11px",
              borderRadius: 999,
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.08)",
              color: "#94A3B8",
              fontSize: 13,
              fontWeight: 650,
            }}
          >
            Clinical Reasoning
          </span>

          <span
            style={{
              padding: "7px 11px",
              borderRadius: 999,
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.08)",
              color: "#94A3B8",
              fontSize: 13,
              fontWeight: 650,
            }}
          >
            Board Exam Prep
          </span>
        </div>

        <section
          style={{
            background: "rgba(18,25,43,.88)",
            border: "1px solid #243041",
            borderRadius: 24,
            padding: "32px 30px",
            boxShadow: "0 20px 42px rgba(0,0,0,.32)",
          }}
        >
          <div
            className="blog-content"
            style={{
              fontSize: 18,
              lineHeight: 1.95,
              color: "#E2E8F0",
            }}
            dangerouslySetInnerHTML={{
              __html: contentHtml,
            }}
          />

          <style>{`
            .blog-content h2 {
              font-size: 30px;
              line-height: 1.18;
              letter-spacing: -0.035em;
              margin: 42px 0 14px;
              color: #ffffff;
            }

            .blog-content h3 {
              font-size: 23px;
              line-height: 1.25;
              letter-spacing: -0.025em;
              margin: 30px 0 10px;
              color: #ffffff;
            }

            .blog-content p {
              margin: 0 0 18px;
            }

            .blog-content ul {
              margin: 18px 0 22px 22px;
            }

            .blog-content li {
              margin-bottom: 10px;
            }

            .blog-content a {
              color: #93c5fd;
              font-weight: 700;
              text-decoration: none;
            }

            .blog-content a:hover {
              text-decoration: underline;
            }

            .blog-content strong {
              color: #ffffff;
            }
          `}</style>
        </section>

        <section
          style={{
            marginTop: 34,
            padding: 26,
            border: "1px solid #243041",
            borderRadius: 20,
            background:
              "linear-gradient(135deg, rgba(99,102,241,.14), rgba(6,182,212,.08))",
          }}
        >
          <h2
            style={{
              fontSize: 26,
              lineHeight: 1.2,
              letterSpacing: "-0.035em",
              marginBottom: 14,
            }}
          >
            Continue Learning with RehabPearls
          </h2>

          <p
            style={{
              color: "#CBD5E1",
              lineHeight: 1.7,
              marginBottom: 18,
            }}
          >
            Strengthen your clinical reasoning with related rehab resources,
            board-style questions, and case-based learning.
          </p>

          <ul
            style={{
              display: "grid",
              gap: 12,
              margin: 0,
              paddingLeft: 20,
              color: "#E2E8F0",
              lineHeight: 1.7,
            }}
          >
            <li>
              <a href="/qbank" style={{ color: "#93C5FD", fontWeight: 800 }}>
                Practice Rehab QBank Questions
              </a>
            </li>

            <li>
              <a href="/guides" style={{ color: "#93C5FD", fontWeight: 800 }}>
                Read Rehabilitation Study Guides
              </a>
            </li>

            <li>
              <a
                href="/cases/neuro"
                style={{ color: "#93C5FD", fontWeight: 800 }}
              >
                Explore Neuro Rehab Cases
              </a>
            </li>

            <li>
              <a
                href="/cases/orthopedic"
                style={{ color: "#93C5FD", fontWeight: 800 }}
              >
                Review Orthopedic Rehab Cases
              </a>
            </li>

            <li>
              <a
                href="/cases/pediatrics"
                style={{ color: "#93C5FD", fontWeight: 800 }}
              >
                Study Pediatric Therapy Cases
              </a>
            </li>
          </ul>
        </section>

        {post.keywords?.length > 0 && (
          <section
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 34,
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
                  color: "#CBD5E1",
                  fontSize: 13,
                  fontWeight: 650,
                }}
              >
                {k}
              </span>
            ))}
          </section>
        )}
      </article>
    </main>
  )
}