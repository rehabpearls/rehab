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
  const words = html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(3, Math.ceil(words / 220))
}

function getPrimaryTopic(keywords?: string[] | null) {
  const list = Array.isArray(keywords) ? keywords.join(" ").toLowerCase() : ""

  if (list.includes("pediatric")) return "Pediatric Therapy"
  if (list.includes("orthopedic")) return "Orthopedic Rehab"
  if (list.includes("neuro")) return "Neuro Rehab"
  if (list.includes("speech")) return "Speech Therapy"
  if (list.includes("occupational")) return "Occupational Therapy"
  if (list.includes("physical")) return "Physical Therapy"

  return "Rehab Education"
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
  const topic = getPrimaryTopic(post.keywords)

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
            <span>{topic}</span>
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
          <article className="rp-content-card">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>

          <aside className="rp-sidebar">
            <div className="rp-sidebar-card">
              <p className="rp-card-eyebrow">Study path</p>
              <h2>Continue after reading</h2>
              <p className="rp-sidebar-copy">
                Turn this topic into practice with board-style questions,
                clinical cases, and guided rehab learning.
              </p>

              <div className="rp-sidebar-links">
                <Link href="/qbank">Practice QBank →</Link>
                <Link href="/guides">Study Guides →</Link>
                <Link href="/cases/neuro">Neuro Cases →</Link>
                <Link href="/cases/orthopedic">Orthopedic Cases →</Link>
                <Link href="/cases/pediatrics">Pediatric Cases →</Link>
              </div>
            </div>

            <div className="rp-sidebar-note">
              <p className="rp-card-eyebrow">For exam prep</p>
              <strong>Read actively.</strong>
              <span>
                Ask what is safest, what information matters most, and what the
                next best clinical decision should be.
              </span>
            </div>
          </aside>
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
            radial-gradient(circle at top left, rgba(99,102,241,.08), transparent 28%),
            radial-gradient(circle at right top, rgba(139,92,246,.06), transparent 24%),
            linear-gradient(180deg, #fafafe 0%, #ffffff 48%, #f8fafc 100%);
          color: #0f172a;
          overflow-x: hidden;
          font-family: inherit;
        }

        .rp-shell {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
        }

        .rp-article-hero {
          padding: 86px 0 52px;
          position: relative;
        }

        .rp-article-hero::after {
          content: "";
          position: absolute;
          inset: auto 0 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,.18), transparent);
        }

        .rp-article-kicker {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 26px;
        }

        .rp-article-kicker a,
        .rp-article-kicker span,
        .rp-pill-row span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 9px 15px;
          border-radius: 999px;
          border: 1px solid rgba(99,102,241,.16);
          background: rgba(255,255,255,.78);
          backdrop-filter: blur(12px);
          color: #4f46e5;
          font-size: 12px;
          font-weight: 850;
          letter-spacing: .02em;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(79,70,229,.05);
        }

        .rp-article-kicker a:hover {
          background: #eef2ff;
          border-color: #c7d2fe;
        }

        .rp-article-hero h1 {
          max-width: 1000px;
          margin: 0 0 28px;
          font-size: clamp(54px, 7.4vw, 92px);
          line-height: .94;
          letter-spacing: -.078em;
          font-weight: 950;
          color: #0f172a;
        }

        .rp-excerpt {
          max-width: 860px;
          margin: 0 0 30px;
          color: #475569;
          font-size: 21px;
          line-height: 1.82;
        }

        .rp-meta-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .rp-meta-row span {
          padding: 9px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,.82);
          border: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 13px;
          font-weight: 760;
          box-shadow: 0 8px 24px rgba(15,23,42,.04);
        }

        .rp-pill-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .rp-article-body-section {
          padding: 46px 0 42px;
        }

        .rp-article-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 34px;
          align-items: start;
        }

        .rp-content-card {
          background: rgba(255,255,255,.82);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(226,232,240,.92);
          border-radius: 36px;
          padding: 56px;
          box-shadow:
            0 20px 80px rgba(15,23,42,.065),
            inset 0 1px 0 rgba(255,255,255,.7);
        }

        .blog-content {
          color: #334155;
        }

        .blog-content h2 {
          margin: 64px 0 22px;
          padding-top: 34px;
          border-top: 1px solid #e2e8f0;
          font-size: 40px;
          line-height: 1.06;
          letter-spacing: -.06em;
          font-weight: 920;
          color: #0f172a;
        }

        .blog-content h2:first-child {
          margin-top: 0;
          padding-top: 0;
          border-top: 0;
        }

        .blog-content h3 {
          margin: 38px 0 14px;
          font-size: 28px;
          line-height: 1.18;
          letter-spacing: -.04em;
          color: #312e81;
          font-weight: 860;
        }

        .blog-content p {
          margin: 0 0 24px;
          color: #475569;
          font-size: 19px;
          line-height: 2;
        }

        .blog-content ul {
          margin: 28px 0 38px;
          padding: 28px 34px 28px 48px;
          background: linear-gradient(180deg, rgba(248,250,252,.92), rgba(255,255,255,.96));
          border: 1px solid #e2e8f0;
          border-radius: 26px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.72);
        }

        .blog-content li {
          margin-bottom: 14px;
          font-size: 17px;
          line-height: 1.9;
          color: #475569;
        }

        .blog-content li:last-child {
          margin-bottom: 0;
        }

        .blog-content li::marker {
          color: #4f46e5;
        }

        .blog-content strong {
          color: #0f172a;
          font-weight: 850;
        }

        .blog-content a {
          color: #4f46e5;
          font-weight: 850;
          text-decoration: none;
          border-bottom: 1px solid rgba(79,70,229,.24);
        }

        .blog-content a:hover {
          color: #312e81;
          border-bottom-color: rgba(49,46,129,.42);
        }

        .rehabpearls-internal-links {
          margin-top: 46px !important;
          padding: 30px !important;
          border-radius: 26px !important;
          background:
            radial-gradient(circle at top left, rgba(99,102,241,.10), transparent 32%),
            linear-gradient(135deg, #eef2ff, #ffffff) !important;
          border: 1px solid #c7d2fe !important;
          color: #374151 !important;
          box-shadow: 0 18px 50px rgba(79,70,229,.08) !important;
        }

        .rehabpearls-internal-links h2 {
          border-top: 0 !important;
          padding-top: 0 !important;
          margin-top: 0 !important;
          color: #0f172a !important;
        }

        .rehabpearls-internal-links p {
          color: #475569 !important;
        }

        .rp-sidebar {
          position: sticky;
          top: 100px;
          display: grid;
          gap: 16px;
        }

        .rp-sidebar-card,
        .rp-sidebar-note {
          padding: 28px;
          border-radius: 30px;
          background: rgba(255,255,255,.84);
          border: 1px solid rgba(226,232,240,.92);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 60px rgba(15,23,42,.065);
        }

        .rp-card-eyebrow {
          margin: 0 0 12px;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .rp-sidebar-card h2 {
          margin: 0 0 14px;
          color: #0f172a;
          font-size: 28px;
          line-height: 1.05;
          letter-spacing: -.05em;
          font-weight: 920;
        }

        .rp-sidebar-copy {
          margin: 0 0 18px;
          color: #64748b;
          line-height: 1.72;
          font-size: 14px;
        }

        .rp-sidebar-links {
          display: grid;
          gap: 12px;
        }

        .rp-sidebar-links a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #4f46e5;
          font-weight: 850;
          text-decoration: none;
          transition: transform .18s ease, background .18s ease, border-color .18s ease;
        }

        .rp-sidebar-links a:hover {
          transform: translateY(-2px);
          background: #eef2ff;
          border-color: #c7d2fe;
        }

        .rp-sidebar-note strong {
          display: block;
          color: #0f172a;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .rp-sidebar-note span {
          display: block;
          color: #64748b;
          line-height: 1.75;
          font-size: 14px;
        }

        .rp-learning-section {
          padding: 22px 0 92px;
        }

        .rp-learning-card {
          padding: 42px;
          border-radius: 36px;
          background:
            radial-gradient(circle at top left, rgba(99,102,241,.10), transparent 30%),
            linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(199,210,254,.75);
          display: grid;
          grid-template-columns: minmax(0,.9fr) minmax(0,1.1fr);
          gap: 34px;
          box-shadow: 0 24px 80px rgba(79,70,229,.085);
        }

        .rp-learning-card h2 {
          margin: 0 0 16px;
          color: #0f172a;
          font-size: 42px;
          line-height: 1;
          letter-spacing: -.06em;
          font-weight: 950;
        }

        .rp-learning-card p {
          color: #475569;
          font-size: 18px;
          line-height: 1.9;
          margin: 0;
        }

        .rp-link-grid {
          display: grid;
          gap: 14px;
        }

        .rp-link-grid a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border-radius: 18px;
          background: rgba(255,255,255,.94);
          border: 1px solid #dbeafe;
          color: #4f46e5;
          font-weight: 850;
          text-decoration: none;
          transition: transform .18s ease, background .18s ease, border-color .18s ease;
        }

        .rp-link-grid a:hover {
          transform: translateY(-2px);
          background: #eef2ff;
          border-color: #c7d2fe;
        }

        .rp-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 34px;
        }

        .rp-keywords span {
          padding: 9px 14px;
          border-radius: 999px;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          color: #4338ca;
          font-size: 13px;
          font-weight: 800;
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
            width: min(100% - 28px, 1180px);
          }

          .rp-article-hero {
            padding: 54px 0 30px;
          }

          .rp-article-hero h1 {
            font-size: clamp(42px, 15vw, 64px);
          }

          .rp-excerpt {
            font-size: 18px;
          }

          .rp-content-card,
          .rp-sidebar-card,
          .rp-sidebar-note,
          .rp-learning-card {
            padding: 24px;
            border-radius: 26px;
          }

          .blog-content h2 {
            font-size: 30px;
          }

          .blog-content h3 {
            font-size: 24px;
          }

          .blog-content p {
            font-size: 17px;
            line-height: 1.85;
          }

          .blog-content ul {
            padding: 24px 24px 24px 34px;
          }

          .rp-learning-card h2 {
            font-size: 32px;
          }
        }
      `}</style>
    </main>
  )
}
