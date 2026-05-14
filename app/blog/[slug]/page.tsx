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
    <main className="rp-blog-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="rp-article">
        <a href="/blog" className="rp-back-link">
          ← Back to Blog
        </a>

        <div className="rp-article-badge">Rehab Education Article</div>

        <h1 className="rp-article-title">{post.title}</h1>

        {post.excerpt && <p className="rp-article-excerpt">{post.excerpt}</p>}

        <div className="rp-pill-row">
          <span>Evidence-Based Rehab</span>
          <span>Clinical Reasoning</span>
          <span>Board Exam Prep</span>
        </div>

        <section className="rp-content-card">
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </section>

        <section className="rp-learning-card">
          <div>
            <p className="rp-card-eyebrow">Next step</p>
            <h2>Continue Learning with RehabPearls</h2>
            <p>
              Strengthen your clinical reasoning with related rehab resources,
              board-style questions, and case-based learning.
            </p>
          </div>

          <div className="rp-link-grid">
            <a href="/qbank">Practice Rehab QBank Questions →</a>
            <a href="/guides">Read Rehabilitation Study Guides →</a>
            <a href="/cases/neuro">Explore Neuro Rehab Cases →</a>
            <a href="/cases/orthopedic">Review Orthopedic Rehab Cases →</a>
            <a href="/cases/pediatrics">Study Pediatric Therapy Cases →</a>
          </div>
        </section>

        {post.keywords?.length > 0 && (
          <section className="rp-keywords">
            {post.keywords.map((k: string) => (
              <span key={k}>{k}</span>
            ))}
          </section>
        )}
      </article>

      <style>{`
        .rp-blog-main {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(99,102,241,.08), transparent 30%),
    linear-gradient(to bottom, #f8fafc, #ffffff);
  color: #111827;
}

        .rp-article {
          max-width: 980px;
          margin: 0 auto;
          padding: 72px 24px 96px;
        }

        .rp-back-link {
          display: inline-flex;
          color: #93C5FD;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 28px;
        }

        .rp-back-link:hover {
          text-decoration: underline;
        }

        .rp-article-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 13px;
          border-radius: 999px;
          background: rgba(99,102,241,.14);
          border: 1px solid rgba(99,102,241,.28);
          color: #C7D2FE;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 22px;
        }

        .rp-article-title {
          font-size: clamp(38px, 6vw, 66px);
          line-height: 1.02;
          letter-spacing: -0.06em;
          font-weight: 900;
          margin: 0 0 22px;
          max-width: 920px;
        }

        .rp-article-excerpt {
          font-size: 20px;
          color: #CBD5E1;
          line-height: 1.75;
          margin: 0 0 34px;
          max-width: 820px;
        }

        .rp-pill-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 42px;
        }

        .rp-pill-row span {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.08);
          color: #CBD5E1;
          font-size: 13px;
          font-weight: 750;
        }

        .rp-content-card {
          background: #ffffff;
          border: 1px solid rgba(148,163,184,.16);
          border-radius: 28px;
          padding: 46px 42px;
          box-shadow: 0 24px 54px rgba(0,0,0,.34);
        }

        .blog-content {
          max-width: 780px;
          margin: 0 auto;
         color: #374151;
        }

        .blog-content h2 {
          font-size: 31px;
          line-height: 1.18;
          letter-spacing: -0.04em;
          margin: 48px 0 18px;
          padding-top: 26px;
          border-top: 1px solid rgba(148,163,184,.14);
         color: #111827;
        }

        .blog-content h2:first-child {
          margin-top: 0;
          padding-top: 0;
          border-top: 0;
        }

        .blog-content h3 {
          font-size: 23px;
          line-height: 1.28;
          letter-spacing: -0.025em;
          margin: 32px 0 12px;
          color: #E0E7FF;
        }

        .blog-content p {
          margin: 0 0 19px;
          color: #CBD5E1;
          font-size: 18px;
          line-height: 1.9;
        }

        .blog-content ul {
          margin: 20px 0 30px;
          padding: 20px 24px 20px 44px;
          background: #f8fafc;
          border: 1px solid rgba(148,163,184,.14);
          border-radius: 20px;
        }

        .blog-content li {
          margin-bottom: 12px;
          color: #DBEAFE;
          line-height: 1.75;
          font-size: 17px;
        }

        .blog-content li::marker {
          color: #818CF8;
        }

        .blog-content a {
          color: #93C5FD;
          font-weight: 850;
          text-decoration: none;
        }

        .blog-content a:hover {
          text-decoration: underline;
        }

        .blog-content strong {
          color: #FFFFFF;
          font-weight: 850;
        }

        .rehabpearls-internal-links {
          margin-top: 44px !important;
          padding: 28px !important;
          border-radius: 22px !important;
          background: linear-gradient(135deg, rgba(99,102,241,.18), rgba(6,182,212,.08)) !important;
          border: 1px solid rgba(129,140,248,.25) !important;
        }

        .rehabpearls-internal-links h2 {
          border-top: 0 !important;
          padding-top: 0 !important;
          margin-top: 0 !important;
        }

        .rp-learning-card {
          margin-top: 36px;
          padding: 30px;
          border: 1px solid rgba(129,140,248,.24);
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(99,102,241,.16), rgba(6,182,212,.08));
          display: grid;
          grid-template-columns: 1fr;
          gap: 22px;
        }

        .rp-card-eyebrow {
          margin: 0 0 8px;
          color: #A5B4FC;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .12em;
        }

        .rp-learning-card h2 {
          font-size: 28px;
          line-height: 1.15;
          letter-spacing: -0.04em;
          margin: 0 0 12px;
        }

        .rp-learning-card p {
          color: #CBD5E1;
          line-height: 1.75;
          margin: 0;
          max-width: 760px;
        }

        .rp-link-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 12px;
        }

        .rp-link-grid a {
          display: block;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(15,23,42,.46);
          border: 1px solid rgba(148,163,184,.16);
          color: #DBEAFE;
          text-decoration: none;
          font-weight: 850;
        }

        .rp-link-grid a:hover {
          border-color: rgba(147,197,253,.45);
          background: rgba(30,41,59,.7);
        }

        .rp-keywords {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 34px;
        }

        .rp-keywords span {
          padding: 8px 12px;
          border-radius: 999px;
         background: #eef2ff;
          border: 1px solid #243041;
          color: #CBD5E1;
          font-size: 13px;
          font-weight: 700;
        }

        @media (max-width: 700px) {
          .rp-article {
            padding: 54px 16px 76px;
          }

          .rp-content-card {
            padding: 30px 20px;
            border-radius: 22px;
          }

          .blog-content p {
            font-size: 16px;
            line-height: 1.78;
          }

          .blog-content h2 {
            font-size: 25px;
          }

          .blog-content h3 {
            font-size: 21px;
          }

          .blog-content ul {
            padding-left: 30px;
          }
        }
      `}</style>
    </main>
  )
}