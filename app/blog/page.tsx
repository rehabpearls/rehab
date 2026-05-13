import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Rehab Blog: PT, OT, SLP & Clinical Reasoning Articles | RehabPearls",
  description:
    "Explore evidence-based rehabilitation articles, physical therapy insights, occupational therapy education, speech therapy resources, clinical reasoning guides, and board exam prep content.",
  alternates: {
    canonical: "https://rehabpearls.com/blog",
  },
  openGraph: {
    title: "Rehab Blog | RehabPearls",
    description:
      "Evidence-based rehab education, PT, OT, SLP learning resources, clinical reasoning articles, and board exam prep insights.",
    url: "https://rehabpearls.com/blog",
    siteName: "RehabPearls",
    type: "website",
  },
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "RehabPearls Blog",
    url: "https://rehabpearls.com/blog",
    description:
      "Evidence-based rehabilitation education for PT, OT, SLP students and clinicians.",
    publisher: {
      "@type": "Organization",
      name: "RehabPearls",
      url: "https://rehabpearls.com",
    },
  }

  return (
    <main className="rp-blog-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <section className="rp-blog-hero">
        <div className="rp-blog-badge">Rehab Education Library</div>

        <h1>Rehab Blog</h1>

        <p>
          Evidence-based rehabilitation insights for physical therapy,
          occupational therapy, speech therapy, clinical reasoning, board exam
          prep, and case-based rehab learning.
        </p>

        <div className="rp-blog-actions">
          <Link href="/qbank">Practice QBank →</Link>
          <Link href="/guides">Study Guides</Link>
        </div>
      </section>

      <section className="rp-topic-strip">
        {[
          "Physical Therapy",
          "Occupational Therapy",
          "Speech Therapy",
          "Clinical Reasoning",
          "Board Exam Prep",
          "Neuro Rehab",
          "Orthopedic Rehab",
          "Pediatric Therapy",
        ].map((topic) => (
          <span key={topic}>{topic}</span>
        ))}
      </section>

      <section className="rp-posts-section">
        <div className="rp-section-head">
          <div>
            <p>Latest Articles</p>
            <h2>Rehab insights, research, and clinical learning</h2>
          </div>

          <Link href="/guides">View guides →</Link>
        </div>

        <div className="rp-post-grid">
          {posts?.map((post, index) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="rp-post-card">
              <article>
                <div className="rp-card-top">
                  <span>{index === 0 ? "Featured" : "Rehab Article"}</span>
                  <span>Read</span>
                </div>

                <h3>{post.title}</h3>

                <p>{post.excerpt}</p>

                {post.keywords?.length > 0 && (
                  <div className="rp-mini-tags">
                    {post.keywords.slice(0, 4).map((k: string) => (
                      <span key={k}>{k}</span>
                    ))}
                  </div>
                )}

                <div className="rp-read-more">Read article →</div>
              </article>
            </Link>
          ))}
        </div>

        {!posts?.length && (
          <div className="rp-empty">
            <h2>Articles are coming soon.</h2>
            <p>
              RehabPearls is preparing evidence-based rehab education content
              for PT, OT, SLP, and clinical reasoning practice.
            </p>
          </div>
        )}
      </section>

      <section className="rp-seo-block">
        <h2>Rehabilitation education built for clinical confidence</h2>
        <p>
          RehabPearls articles help therapy students and clinicians connect
          research, patient care, board-style exam preparation, and practical
          clinical reasoning. Explore physical therapy, occupational therapy,
          speech-language pathology, neurological rehabilitation, orthopedic
          rehabilitation, pediatric therapy, and evidence-based rehab learning.
        </p>
      </section>

      <style>{`
        .rp-blog-main {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 0%, rgba(99,102,241,.16), transparent 32%),
            radial-gradient(circle at 90% 12%, rgba(6,182,212,.10), transparent 28%),
            #0B1020;
          color: #F8FAFC;
          padding: 72px 24px 96px;
        }

        .rp-blog-hero {
          max-width: 1100px;
          margin: 0 auto 34px;
        }

        .rp-blog-badge {
          display: inline-flex;
          padding: 7px 13px;
          border-radius: 999px;
          background: rgba(99,102,241,.14);
          border: 1px solid rgba(99,102,241,.28);
          color: #C7D2FE;
          font-size: 13px;
          font-weight: 850;
          margin-bottom: 22px;
        }

        .rp-blog-hero h1 {
          font-size: clamp(48px, 8vw, 92px);
          line-height: .95;
          letter-spacing: -0.075em;
          font-weight: 950;
          margin: 0 0 22px;
        }

        .rp-blog-hero p {
          color: #CBD5E1;
          font-size: 20px;
          line-height: 1.75;
          max-width: 820px;
          margin: 0 0 30px;
        }

        .rp-blog-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .rp-blog-actions a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 850;
        }

        .rp-blog-actions a:first-child {
          background: #6366F1;
          color: #fff;
          box-shadow: 0 14px 34px rgba(99,102,241,.32);
        }

        .rp-blog-actions a:last-child {
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
          color: #E2E8F0;
        }

        .rp-topic-strip {
          max-width: 1100px;
          margin: 0 auto 42px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .rp-topic-strip span {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.055);
          border: 1px solid rgba(255,255,255,.08);
          color: #CBD5E1;
          font-size: 13px;
          font-weight: 750;
        }

        .rp-posts-section {
          max-width: 1100px;
          margin: 0 auto;
        }

        .rp-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 22px;
        }

        .rp-section-head p {
          margin: 0 0 8px;
          color: #A5B4FC;
          text-transform: uppercase;
          letter-spacing: .12em;
          font-size: 12px;
          font-weight: 900;
        }

        .rp-section-head h2 {
          margin: 0;
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.1;
          letter-spacing: -0.05em;
        }

        .rp-section-head a {
          color: #93C5FD;
          text-decoration: none;
          font-weight: 850;
          white-space: nowrap;
        }

        .rp-post-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
          gap: 18px;
        }

        .rp-post-card {
          text-decoration: none;
          color: inherit;
        }

        .rp-post-card article {
          height: 100%;
          background: rgba(18,25,43,.9);
          border: 1px solid rgba(148,163,184,.16);
          border-radius: 26px;
          padding: 26px;
          box-shadow: 0 18px 44px rgba(0,0,0,.28);
          transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }

        .rp-post-card:hover article {
          transform: translateY(-3px);
          border-color: rgba(129,140,248,.42);
          background: rgba(22,31,53,.95);
        }

        .rp-card-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .rp-card-top span {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 850;
          background: rgba(99,102,241,.14);
          border: 1px solid rgba(99,102,241,.25);
          color: #C7D2FE;
        }

        .rp-post-card h3 {
          font-size: 28px;
          line-height: 1.14;
          letter-spacing: -0.04em;
          margin: 0 0 14px;
        }

        .rp-post-card p {
          color: #94A3B8;
          line-height: 1.75;
          font-size: 16px;
          margin: 0;
        }

        .rp-mini-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .rp-mini-tags span {
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(15,23,42,.65);
          border: 1px solid rgba(148,163,184,.13);
          color: #CBD5E1;
          font-size: 12px;
          font-weight: 700;
        }

        .rp-read-more {
          margin-top: 22px;
          color: #93C5FD;
          font-weight: 900;
        }

        .rp-empty {
          border: 1px solid rgba(148,163,184,.16);
          background: rgba(18,25,43,.86);
          border-radius: 24px;
          padding: 32px;
        }

        .rp-empty h2 {
          margin: 0 0 10px;
          font-size: 28px;
        }

        .rp-empty p {
          color: #CBD5E1;
          line-height: 1.7;
          margin: 0;
        }

        .rp-seo-block {
          max-width: 1100px;
          margin: 36px auto 0;
          padding: 34px;
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(99,102,241,.13), rgba(6,182,212,.07));
          border: 1px solid rgba(129,140,248,.22);
        }

        .rp-seo-block h2 {
          margin: 0 0 14px;
          font-size: 34px;
          line-height: 1.15;
          letter-spacing: -0.045em;
        }

        .rp-seo-block p {
          color: #CBD5E1;
          line-height: 1.8;
          font-size: 17px;
          max-width: 900px;
          margin: 0;
        }

        @media (max-width: 700px) {
          .rp-blog-main {
            padding: 54px 16px 78px;
          }

          .rp-section-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .rp-blog-hero p {
            font-size: 17px;
          }

          .rp-post-card h3 {
            font-size: 24px;
          }
        }
      `}</style>
    </main>
  )
}