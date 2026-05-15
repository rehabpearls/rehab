import Link from "next/link"
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

function formatDate(value?: string | null) {
  if (!value) return "RehabPearls"
  try {
    return new Intl.DateTimeFormat("en", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value))
  } catch {
    return "RehabPearls"
  }
}

function readingTime(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length
  return Math.max(3, Math.ceil(words / 220))
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
  const minutes = readingTime(contentHtml)

  return (
    <main className="rp-blog-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="rp-article-hero">
        <div className="rp-shell">
          <div className="rp-article-kicker">
            <Link href="/blog">← Back to Blog</Link>
            <span>Rehab Education Article</span>
          </div>

          <h1>{post.title}</h1>

          {post.excerpt && <p className="rp-excerpt">{post.excerpt}</p>}

          <div className="rp-meta-row">
            <span>RehabPearls Editorial</span>
            <span>{formatDate(post.published_at || post.created_at)}</span>
            <span>{minutes} min read</span>
          </div>

          <div className="rp-pill-row">
            <span>Evidence-Based Rehab</span>
            <span>Clinical Reasoning</span>
            <span>Board Exam Prep</span>
          </div>
        </div>
      </section>

      <section className="rp-article-body-section">
        <div className="rp-shell rp-article-layout">
          <aside className="rp-sidebar">
            <div className="rp-sidebar-card">
              <p className="rp-card-eyebrow">Study path</p>
              <h2>Continue after reading</h2>
              <div className="rp-sidebar-links">
                <Link href="/qbank">Practice QBank →</Link>
                <Link href="/guides">Study Guides →</Link>
                <Link href="/cases/neuro">Neuro Cases →</Link>
                <Link href="/cases/orthopedic">Orthopedic Cases →</Link>
                <Link href="/cases/pediatrics">Pediatric Cases →</Link>
              </div>
            </div>
          </aside>

          <article className="rp-content-card">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>
        </div>
      </section>

      <section className="rp-learning-section">
        <div className="rp-shell">
          <div className="rp-learning-card">
            <div>
              <p className="rp-card-eyebrow">Next step</p>
              <h2>Continue Learning with RehabPearls</h2>
              <p>
                Strengthen your clinical reasoning with related rehab resources,
                board-style questions, and case-based learning.
              </p>
            </div>

            <div className="rp-link-grid">
              <Link href="/qbank">Practice Rehab QBank Questions →</Link>
              <Link href="/guides">Read Rehabilitation Study Guides →</Link>
              <Link href="/cases/neuro">Explore Neuro Rehab Cases →</Link>
              <Link href="/cases/orthopedic">
                Review Orthopedic Rehab Cases →
              </Link>
              <Link href="/cases/pediatrics">Study Pediatric Therapy Cases →</Link>
            </div>
          </div>

          {post.keywords?.length > 0 && (
            <section className="rp-keywords">
              {post.keywords.map((k: string) => (
                <span key={k}>{k}</span>
              ))}
            </section>
          )}
        </div>
      </section>

      <style>{`
        .rp-blog-main {
          min-height: 100vh;
          background:
            radial-gradient(circle at 8% 0%, rgba(99,102,241,.12), transparent 34%),
            radial-gradient(circle at 92% 12%, rgba(79,70,229,.08), transparent 30%),
            linear-gradient(180deg, #f8fafc 0%, #ffffff 46%, #f8fafc 100%);
          color: #111827;
          font-family: inherit;
        }

        .rp-shell {
          width: min(1080px, calc(100% - 48px));
          margin: 0 auto;
        }

        .rp-article-hero {
          padding: 72px 0 44px;
          border-bottom: 1px solid #e0e7ff;
        }

        .rp-article-kicker {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 26px;
        }

        .rp-article-kicker a,
        .rp-article-kicker span,
        .rp-pill-row span {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          border-radius: 999px;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          color: #4f46e5;
          font-size: 13px;
          font-weight: 850;
          text-decoration: none;
          padding: 8px 13px;
        }

        .rp-article-kicker a:hover {
          background: #e0e7ff;
        }

        .rp-article-hero h1 {
          max-width: 960px;
          margin: 0 0 24px;
          color: #111827;
          font-size: clamp(44px, 7vw, 82px);
          line-height: .98;
          letter-spacing: -0.075em;
          font-weight: 950;
        }

        .rp-excerpt {
          max-width: 820px;
          margin: 0 0 28px;
          color: #4b5563;
          font-size: 20px;
          line-height: 1.8;
        }

        .rp-meta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .rp-meta-row span {
          color: #6b7280;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 750;
        }

        .rp-pill-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .rp-article-body-section {
          padding: 54px 0 36px;
        }

        .rp-article-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: 28px;
          align-items: start;
        }

        .rp-content-card {
          background: #ffffff;
          border: 1px solid #e0e7ff;
          border-radius: 32px;
          padding: 48px;
          box-shadow: 0 24px 70px rgba(15,23,42,.08);
        }

        .blog-content {
          color: #374151;
        }

        .blog-content h2 {
          font-size: 34px;
          line-height: 1.16;
          letter-spacing: -0.045em;
          margin: 50px 0 18px;
          padding-top: 28px;
          border-top: 1px solid #e0e7ff;
          color: #111827;
          font-weight: 900;
        }

        .blog-content h2:first-child {
          margin-top: 0;
          padding-top: 0;
          border-top: 0;
        }

        .blog-content h3 {
          font-size: 24px;
          line-height: 1.28;
          letter-spacing: -0.025em;
          margin: 34px 0 12px;
          color: #3730a3;
          font-weight: 850;
        }

        .blog-content p {
          margin: 0 0 20px;
          color: #374151;
          font-size: 18px;
          line-height: 1.95;
        }

        .blog-content ul {
          margin: 24px 0 34px;
          padding: 24px 28px 24px 46px;
          background: #f8fafc;
          border: 1px solid #e0e7ff;
          border-radius: 22px;
        }

        .blog-content li {
          margin-bottom: 12px;
          color: #374151;
          line-height: 1.8;
          font-size: 17px;
        }

        .blog-content li::marker {
          color: #4f46e5;
        }

        .blog-content a {
          color: #4f46e5;
          font-weight: 850;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
        }

        .blog-content strong {
          color: #111827;
          font-weight: 850;
        }

        .rehabpearls-internal-links {
          margin-top: 44px !important;
          padding: 28px !important;
          border-radius: 24px !important;
          background: linear-gradient(135deg, #eef2ff, #ffffff) !important;
          border: 1px solid #c7d2fe !important;
          color: #374151 !important;
        }

        .rehabpearls-internal-links h2 {
          border-top: 0 !important;
          padding-top: 0 !important;
          margin-top: 0 !important;
          color: #111827 !important;
        }

        .rp-sidebar {
          position: sticky;
          top: 96px;
        }

        .rp-sidebar-card {
          background: #ffffff;
          border: 1px solid #e0e7ff;
          border-radius: 28px;
          padding: 24px;
          box-shadow: 0 18px 50px rgba(15,23,42,.07);
        }

        .rp-card-eyebrow {
          margin: 0 0 10px;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .16em;
        }

        .rp-sidebar-card h2 {
          margin: 0 0 18px;
          color: #111827;
          font-size: 24px;
          line-height: 1.12;
          letter-spacing: -0.04em;
          font-weight: 900;
        }

        .rp-sidebar-links {
          display: grid;
          gap: 10px;
        }

        .rp-sidebar-links a {
          display: block;
          padding: 12px 14px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          color: #4f46e5;
          text-decoration: none;
          font-weight: 850;
        }

        .rp-sidebar-links a:hover {
          background: #eef2ff;
          border-color: #c7d2fe;
        }

        .rp-learning-section {
          padding: 24px 0 84px;
        }

        .rp-learning-card {
          padding: 34px;
          border: 1px solid #c7d2fe;
          border-radius: 32px;
          background: linear-gradient(135deg, #eef2ff 0%, #ffffff 100%);
          display: grid;
          grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
          gap: 28px;
          box-shadow: 0 24px 70px rgba(79,70,229,.10);
        }

        .rp-learning-card h2 {
          color: #111827;
          font-size: 34px;
          line-height: 1.08;
          letter-spacing: -0.05em;
          font-weight: 920;
          margin: 0 0 14px;
        }

        .rp-learning-card p {
          color: #4b5563;
          line-height: 1.8;
          margin: 0;
          font-size: 17px;
        }

        .rp-link-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .rp-link-grid a {
          display: block;
          padding: 14px 16px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #c7d2fe;
          color: #4f46e5;
          text-decoration: none;
          font-weight: 850;
        }

        .rp-link-grid a:hover {
          background: #eef2ff;
        }

        .rp-keywords {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 30px;
        }

        .rp-keywords span {
          padding: 8px 12px;
          border-radius: 999px;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          color: #4f46e5;
          font-size: 13px;
          font-weight: 750;
        }

        @media (max-width: 980px) {
          .rp-article-layout {
            grid-template-columns: 1fr;
          }

          .rp-sidebar {
            position: relative;
            top: auto;
            order: 2;
          }

          .rp-learning-card {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .rp-shell {
            width: min(100% - 32px, 1080px);
          }

          .rp-article-hero {
            padding: 56px 0 34px;
          }

          .rp-article-hero h1 {
            font-size: clamp(40px, 14vw, 62px);
          }

          .rp-content-card,
          .rp-learning-card,
          .rp-sidebar-card {
            padding: 22px;
            border-radius: 24px;
          }

          .blog-content h2 {
            font-size: 27px;
          }

          .blog-content h3 {
            font-size: 22px;
          }

          .blog-content p {
            font-size: 16px;
            line-height: 1.82;
          }

          .blog-content ul {
            padding-left: 32px;
          }
        }
      `}</style>
    </main>
  )
}