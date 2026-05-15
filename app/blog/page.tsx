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

function formatDate(value?: string | null) {
  if (!value) return "RehabPearls"
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value))
  } catch {
    return "RehabPearls"
  }
}

function getPrimaryTopic(keywords?: string[] | null) {
  const list = Array.isArray(keywords) ? keywords.join(" ").toLowerCase() : ""

  if (list.includes("pediatric")) return "Pediatric Therapy"
  if (list.includes("orthopedic")) return "Orthopedic Rehab"
  if (list.includes("neuro")) return "Neuro Rehab"
  if (list.includes("speech")) return "Speech Therapy"
  if (list.includes("occupational")) return "Occupational Therapy"
  if (list.includes("physical")) return "Physical Therapy"

  return "Rehab Article"
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  const featuredPost = posts?.[0]
  const remainingPosts = posts?.slice(1) || []

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
        <div className="rp-shell">
          <div className="rp-hero-grid">
            <div>
              <div className="rp-blog-badge">Rehab Education Library</div>

              <h1>Rehab Blog</h1>

              <p>
                Evidence-based rehabilitation insights for physical therapy,
                occupational therapy, speech therapy, clinical reasoning, board
                exam prep, and case-based rehab learning.
              </p>

              <div className="rp-blog-actions">
                <Link href="/qbank">Practice QBank →</Link>
                <Link href="/guides">Study Guides</Link>
              </div>
            </div>

            <aside className="rp-hero-card">
              <p className="rp-card-eyebrow">Built for learners</p>
              <h2>Turn rehab research into clinical reasoning.</h2>
              <p>
                Use articles to connect evidence, patient safety, treatment
                planning, and board-style decision-making.
              </p>
              <div className="rp-hero-mini-grid">
                <span>PT</span>
                <span>OT</span>
                <span>SLP</span>
                <span>Boards</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="rp-topic-section">
        <div className="rp-shell rp-topic-strip">
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
        </div>
      </section>

      {featuredPost && (
        <section className="rp-featured-section">
          <div className="rp-shell">
            <div className="rp-section-head">
              <div>
                <p>Featured article</p>
                <h2>Start with the latest rehab learning guide</h2>
              </div>

              <Link href="/guides">View guides →</Link>
            </div>

            <Link
              href={`/blog/${featuredPost.slug}`}
              className="rp-featured-card"
            >
              <article>
                <div className="rp-featured-content">
                  <div className="rp-card-top">
                    <span>Featured</span>
                    <span>{getPrimaryTopic(featuredPost.keywords)}</span>
                  </div>

                  <h3>{featuredPost.title}</h3>

                  <p>{featuredPost.excerpt}</p>

                  {featuredPost.keywords?.length > 0 && (
                    <div className="rp-mini-tags">
                      {featuredPost.keywords.slice(0, 5).map((k: string) => (
                        <span key={k}>{k}</span>
                      ))}
                    </div>
                  )}

                  <div className="rp-read-more">Read featured article →</div>
                </div>

                <div className="rp-featured-side">
                  <span>Published</span>
                  <strong>
                    {formatDate(featuredPost.published_at || featuredPost.created_at)}
                  </strong>
                  <p>
                    Evidence-based rehab education for stronger clinical
                    reasoning and exam confidence.
                  </p>
                </div>
              </article>
            </Link>
          </div>
        </section>
      )}

      <section className="rp-posts-section">
        <div className="rp-shell">
          <div className="rp-section-head">
            <div>
              <p>Latest articles</p>
              <h2>Rehab insights, research, and clinical learning</h2>
            </div>

            <Link href="/qbank">Practice questions →</Link>
          </div>

          {posts?.length ? (
            <div className="rp-post-grid">
              {(featuredPost ? remainingPosts : posts).map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="rp-post-card"
                >
                  <article>
                    <div className="rp-card-top">
                      <span>{getPrimaryTopic(post.keywords)}</span>
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

                    <div className="rp-card-footer">
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                      <strong>Read article →</strong>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rp-empty">
              <h2>Articles are coming soon.</h2>
              <p>
                RehabPearls is preparing evidence-based rehab education content
                for PT, OT, SLP, and clinical reasoning practice.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="rp-seo-section">
        <div className="rp-shell">
          <div className="rp-seo-block">
            <div>
              <p className="rp-card-eyebrow">Clinical confidence</p>
              <h2>Rehabilitation education built for better reasoning</h2>
            </div>
            <p>
              RehabPearls articles help therapy students and clinicians connect
              research, patient care, board-style exam preparation, and
              practical clinical reasoning. Explore physical therapy,
              occupational therapy, speech-language pathology, neurological
              rehabilitation, orthopedic rehabilitation, pediatric therapy, and
              evidence-based rehab learning.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .rp-blog-main {
          min-height: 100vh;
          background:
            radial-gradient(circle at 8% 0%, rgba(99,102,241,.12), transparent 34%),
            radial-gradient(circle at 92% 12%, rgba(79,70,229,.08), transparent 30%),
            linear-gradient(180deg, #f8fafc 0%, #ffffff 48%, #f8fafc 100%);
          color: #111827;
          font-family: inherit;
        }

        .rp-shell {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
        }

        .rp-blog-hero {
          padding: 88px 0 42px;
          border-bottom: 1px solid #e0e7ff;
        }

        .rp-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(320px, .75fr);
          gap: 34px;
          align-items: center;
        }

        .rp-blog-badge,
        .rp-card-top span,
        .rp-topic-strip span {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          border-radius: 999px;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          color: #4f46e5;
          font-size: 13px;
          font-weight: 850;
        }

        .rp-blog-badge {
          padding: 8px 14px;
          margin-bottom: 24px;
        }

        .rp-blog-hero h1 {
          font-size: clamp(56px, 9vw, 104px);
          line-height: .92;
          letter-spacing: -0.085em;
          font-weight: 950;
          color: #111827;
          margin: 0 0 24px;
        }

        .rp-blog-hero p {
          max-width: 780px;
          color: #4b5563;
          font-size: 20px;
          line-height: 1.75;
          margin: 0 0 30px;
        }

        .rp-blog-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .rp-blog-actions a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 20px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 850;
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
        }

        .rp-blog-actions a:first-child {
          background: #4f46e5;
          color: #ffffff;
          box-shadow: 0 14px 34px rgba(79,70,229,.28);
        }

        .rp-blog-actions a:first-child:hover {
          background: #4338ca;
          transform: translateY(-1px);
        }

        .rp-blog-actions a:last-child {
          background: #ffffff;
          color: #4f46e5;
          border: 1px solid #c7d2fe;
        }

        .rp-blog-actions a:last-child:hover {
          background: #eef2ff;
        }

        .rp-hero-card {
          background: rgba(255,255,255,.82);
          border: 1px solid #e0e7ff;
          border-radius: 30px;
          padding: 30px;
          box-shadow: 0 24px 70px rgba(79,70,229,.12);
          backdrop-filter: blur(14px);
        }

        .rp-card-eyebrow {
          margin: 0 0 10px;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .16em;
        }

        .rp-hero-card h2 {
          margin: 0 0 14px;
          color: #111827;
          font-size: 30px;
          line-height: 1.08;
          letter-spacing: -0.045em;
          font-weight: 900;
        }

        .rp-hero-card p {
          margin: 0;
          color: #4b5563;
          font-size: 16px;
          line-height: 1.75;
        }

        .rp-hero-mini-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 22px;
        }

        .rp-hero-mini-grid span {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          border-radius: 16px;
          background: #eef2ff;
          color: #4f46e5;
          font-weight: 900;
          border: 1px solid #c7d2fe;
        }

        .rp-topic-section {
          padding: 24px 0;
          background: #ffffff;
          border-bottom: 1px solid #eef2ff;
        }

        .rp-topic-strip {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .rp-topic-strip span {
          padding: 8px 12px;
        }

        .rp-featured-section,
        .rp-posts-section,
        .rp-seo-section {
          padding: 52px 0;
        }

        .rp-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
        }

        .rp-section-head p {
          margin: 0 0 8px;
          color: #4f46e5;
          text-transform: uppercase;
          letter-spacing: .14em;
          font-size: 12px;
          font-weight: 900;
        }

        .rp-section-head h2 {
          margin: 0;
          color: #111827;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1.05;
          letter-spacing: -0.055em;
          font-weight: 920;
        }

        .rp-section-head a {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 850;
          white-space: nowrap;
        }

        .rp-featured-card,
        .rp-post-card {
          display: block;
          color: inherit;
          text-decoration: none;
        }

        .rp-featured-card article {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(260px, .65fr);
          gap: 24px;
          background:
            radial-gradient(circle at top right, rgba(99,102,241,.12), transparent 34%),
            #ffffff;
          border: 1px solid #e0e7ff;
          border-radius: 34px;
          padding: 34px;
          box-shadow: 0 24px 70px rgba(15,23,42,.08);
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        }

        .rp-featured-card:hover article {
          transform: translateY(-3px);
          border-color: #c7d2fe;
          box-shadow: 0 30px 90px rgba(79,70,229,.14);
        }

        .rp-card-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .rp-card-top span {
          padding: 7px 11px;
        }

        .rp-featured-content h3 {
          color: #111827;
          margin: 0 0 16px;
          font-size: clamp(34px, 5vw, 56px);
          line-height: 1.03;
          letter-spacing: -0.065em;
          font-weight: 920;
        }

        .rp-featured-content p,
        .rp-post-card p,
        .rp-seo-block p {
          color: #4b5563;
          line-height: 1.8;
          font-size: 17px;
          margin: 0;
        }

        .rp-featured-side {
          border-radius: 26px;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          padding: 24px;
          align-self: stretch;
        }

        .rp-featured-side span {
          display: block;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .14em;
          margin-bottom: 8px;
        }

        .rp-featured-side strong {
          display: block;
          color: #111827;
          font-size: 22px;
          margin-bottom: 16px;
        }

        .rp-mini-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .rp-mini-tags span {
          padding: 7px 10px;
          border-radius: 999px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          color: #374151;
          font-size: 12px;
          font-weight: 750;
        }

        .rp-read-more {
          margin-top: 24px;
          color: #4f46e5;
          font-weight: 900;
        }

        .rp-post-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 22px;
        }

        .rp-post-card article {
          height: 100%;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 18px 50px rgba(15,23,42,.07);
          transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
        }

        .rp-post-card:hover article {
          transform: translateY(-4px);
          border-color: #c7d2fe;
          box-shadow: 0 28px 70px rgba(79,70,229,.12);
        }

        .rp-post-card h3 {
          color: #111827;
          font-size: 28px;
          line-height: 1.12;
          letter-spacing: -0.045em;
          font-weight: 900;
          margin: 0 0 14px;
        }

        .rp-card-footer {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid #eef2ff;
        }

        .rp-card-footer span {
          color: #6b7280;
          font-size: 13px;
          font-weight: 700;
        }

        .rp-card-footer strong {
          color: #4f46e5;
          font-size: 14px;
          white-space: nowrap;
        }

        .rp-empty {
          border: 1px solid #e0e7ff;
          background: #ffffff;
          border-radius: 28px;
          padding: 36px;
          box-shadow: 0 18px 50px rgba(15,23,42,.07);
        }

        .rp-empty h2 {
          margin: 0 0 10px;
          color: #111827;
          font-size: 28px;
        }

        .rp-empty p {
          color: #4b5563;
          line-height: 1.7;
          margin: 0;
        }

        .rp-seo-block {
          display: grid;
          grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
          gap: 28px;
          padding: 38px;
          border-radius: 32px;
          background: linear-gradient(135deg, #eef2ff 0%, #ffffff 100%);
          border: 1px solid #c7d2fe;
          box-shadow: 0 24px 70px rgba(79,70,229,.10);
        }

        .rp-seo-block h2 {
          margin: 0;
          color: #111827;
          font-size: 36px;
          line-height: 1.08;
          letter-spacing: -0.05em;
          font-weight: 920;
        }

        @media (max-width: 900px) {
          .rp-hero-grid,
          .rp-featured-card article,
          .rp-seo-block {
            grid-template-columns: 1fr;
          }

          .rp-blog-hero h1 {
            font-size: clamp(48px, 14vw, 78px);
          }

          .rp-section-head {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .rp-shell {
            width: min(100% - 32px, 1180px);
          }

          .rp-blog-hero {
            padding: 58px 0 34px;
          }

          .rp-featured-section,
          .rp-posts-section,
          .rp-seo-section {
            padding: 36px 0;
          }

          .rp-featured-card article,
          .rp-post-card article,
          .rp-seo-block,
          .rp-hero-card {
            padding: 22px;
            border-radius: 24px;
          }

          .rp-featured-content h3,
          .rp-post-card h3 {
            font-size: 25px;
          }

          .rp-card-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  )
}