import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

type TopicPageParams = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: TopicPageParams) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: topic } = await supabase
    .from("topics")
    .select("name, slug, seo_title, seo_description, short_description")
    .eq("slug", slug)
    .single()

  if (!topic) {
    return {
      title: "Topic Not Found | RehabPearls",
    }
  }

  return {
    title:
      topic.seo_title ||
      `${topic.name} Rehab Questions, Cases & Study Guide | RehabPearls`,
    description:
      topic.seo_description ||
      topic.short_description ||
      `Study ${topic.name} with rehab questions, clinical reasoning, board-style exam prep, and evidence-based rehabilitation learning.`,
    alternates: {
      canonical: `https://rehabpearls.com/topics/${topic.slug}`,
    },
    openGraph: {
      title:
        topic.seo_title ||
        `${topic.name} Rehab Learning | RehabPearls`,
      description:
        topic.seo_description ||
        topic.short_description ||
        `Explore ${topic.name} rehabilitation education, QBank questions, clinical cases, and board exam prep.`,
      url: `https://rehabpearls.com/topics/${topic.slug}`,
      siteName: "RehabPearls",
      type: "website",
    },
  }
}

export default async function TopicDetailPage({ params }: TopicPageParams) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: topic } = await supabase
    .from("topics")
    .select(`
      id,
      name,
      slug,
      short_description,
      seo_title,
      seo_description,
      icon,
      topic_groups (
        name,
        slug
      )
    `)
    .eq("slug", slug)
    .single()

  if (!topic) notFound()

  const [{ data: childTopics }, { data: linkedQuestions }, { data: linkedBlogs }] =
    await Promise.all([
      supabase
        .from("topics")
        .select("id, name, slug, short_description, icon")
        .eq("parent_topic_id", topic.id)
        .order("order_index", { ascending: true })
        .order("name", { ascending: true }),

      supabase
        .from("question_topics")
        .select(`
          question_id,
          questions (
            id,
            question,
            difficulty,
            status,
            explanation,
            category_id
          )
        `)
        .eq("topic_id", topic.id)
        .limit(8),

      supabase
        .from("blog_topics")
        .select(`
          blog_post_id,
          blog_posts (
            id,
            title,
            slug,
            excerpt,
            status,
            published_at
          )
        `)
        .eq("topic_id", topic.id)
        .limit(6),
    ])

  const questions =
    linkedQuestions
      ?.map((row: any) => row.questions)
      .filter((q: any) => q && (q.status === "approved" || q.status === "published")) ||
    []

  const blogs =
    linkedBlogs
      ?.map((row: any) => row.blog_posts)
      .filter((b: any) => b && b.status === "published") || []

  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: topic.name,
    url: `https://rehabpearls.com/topics/${topic.slug}`,
    description:
      topic.seo_description ||
      topic.short_description ||
      `Rehabilitation learning resource for ${topic.name}.`,
    educationalLevel: "Professional",
    learningResourceType: "Study guide",
    publisher: {
      "@type": "Organization",
      name: "RehabPearls",
      url: "https://rehabpearls.com",
    },
  }

  return (
    <main className="rp-topic-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article className="rp-topic-page">
        <Link href="/topics" className="rp-back">
          ← All Rehab Topics
        </Link>

        <section className="rp-topic-hero">
          <div className="rp-topic-icon">{topic.icon || getTopicIcon(topic.name)}</div>

          <div>
            <div className="rp-badge">
              {Array.isArray(topic.topic_groups)
  ? topic.topic_groups[0]?.name || "Rehab Topic"
  : topic.topic_groups?.name || "Rehab Topic"}
            </div>

            <h1>{topic.name}</h1>

            <p>
              {topic.short_description ||
                topic.seo_description ||
                `Study ${topic.name} with board-style questions, clinical reasoning pearls, evidence-based rehab concepts, and practical therapy applications.`}
            </p>

            <div className="rp-actions">
              <Link href="/qbank">Practice QBank →</Link>
              <Link href="/guides">Study Guides</Link>
            </div>
          </div>
        </section>

        <section className="rp-overview-grid">
          <div className="rp-overview-card">
            <p className="rp-eyebrow">Clinical Overview</p>
            <h2>What to know about {topic.name}</h2>
            <p>
              {topic.name} is a high-yield rehabilitation topic that connects
              assessment, functional goals, patient safety, intervention
              planning, and evidence-based clinical reasoning. RehabPearls
              organizes this topic for physical therapy, occupational therapy,
              speech-language pathology, rehabilitation clinicians, and board
              exam preparation.
            </p>
          </div>

          <div className="rp-stat-card">
            <div>
              <span>{questions.length}</span>
              <p>linked questions</p>
            </div>

            <div>
              <span>{blogs.length}</span>
              <p>linked articles</p>
            </div>

            <div>
              <span>{childTopics?.length || 0}</span>
              <p>subtopics</p>
            </div>
          </div>
        </section>

        <section className="rp-pearls">
          <div className="rp-section-head">
            <p>Board Pearls</p>
            <h2>High-yield clinical reasoning points</h2>
          </div>

          <div className="rp-pearl-grid">
            {[
              "Identify the primary impairment before selecting an intervention.",
              "Connect body structure findings with functional limitations.",
              "Prioritize safety, contraindications, and red flags in exam-style questions.",
              "Use patient goals and clinical presentation to guide progression.",
            ].map((pearl) => (
              <div key={pearl} className="rp-pearl">
                <span>✓</span>
                <p>{pearl}</p>
              </div>
            ))}
          </div>
        </section>

        {childTopics && childTopics.length > 0 && (
          <section className="rp-section">
            <div className="rp-section-head">
              <p>Subtopics</p>
              <h2>Continue deeper into {topic.name}</h2>
            </div>

            <div className="rp-card-grid">
              {childTopics.map((child: any) => (
                <Link href={`/topics/${child.slug}`} key={child.id} className="rp-card">
                  <article>
                    <div className="rp-mini-icon">{child.icon || getTopicIcon(child.name)}</div>
                    <h3>{child.name}</h3>
                    <p>
                      {child.short_description ||
                        "Explore clinical reasoning, rehab concepts, and board-style learning for this subtopic."}
                    </p>
                    <strong>Open subtopic →</strong>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="rp-section">
          <div className="rp-section-head">
            <p>QBank</p>
            <h2>Related board-style questions</h2>
          </div>

          {questions.length > 0 ? (
            <div className="rp-question-list">
              {questions.map((q: any) => (
                <div key={q.id} className="rp-question-card">
                  <div className="rp-question-top">
                    <span>{q.difficulty || "medium"}</span>
                    <span>Clinical reasoning</span>
                  </div>

                  <h3>{q.question}</h3>

                  {q.explanation && <p>{q.explanation.slice(0, 180)}...</p>}

                  <Link href="/qbank">Practice in QBank →</Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rp-empty">
              <h3>Questions coming soon</h3>
              <p>
                This topic is ready for linked QBank questions. Add questions in
                admin and connect them through question_topics.
              </p>
              <Link href="/qbank">Explore QBank →</Link>
            </div>
          )}
        </section>

        <section className="rp-section">
          <div className="rp-section-head">
            <p>Articles</p>
            <h2>Related rehab education articles</h2>
          </div>

          {blogs.length > 0 ? (
            <div className="rp-card-grid">
              {blogs.map((blog: any) => (
                <Link href={`/blog/${blog.slug}`} key={blog.id} className="rp-card">
                  <article>
                    <h3>{blog.title}</h3>
                    <p>
                      {blog.excerpt ||
                        "Read this rehabilitation education article and connect research with clinical reasoning."}
                    </p>
                    <strong>Read article →</strong>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rp-empty">
              <h3>Articles coming soon</h3>
              <p>
                AI blog posts can later be automatically linked to this topic
                for stronger topical authority and internal SEO.
              </p>
              <Link href="/blog">Visit Rehab Blog →</Link>
            </div>
          )}
        </section>

        <section className="rp-cta">
          <h2>Master {topic.name} with RehabPearls</h2>
          <p>
            Build confidence with board-style questions, structured rehab
            topics, clinical pearls, and evidence-based study paths.
          </p>
          <div>
            <Link href="/qbank">Start Practicing →</Link>
            <Link href="/guides">Read Guides</Link>
          </div>
        </section>
      </article>

      <style>{`
        .rp-topic-main {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 0%, rgba(99,102,241,.16), transparent 32%),
            radial-gradient(circle at 90% 12%, rgba(6,182,212,.10), transparent 28%),
            #0B1020;
          color: #F8FAFC;
          padding: 72px 24px 96px;
        }

        .rp-topic-page {
          max-width: 1120px;
          margin: 0 auto;
        }

        .rp-back {
          display: inline-flex;
          color: #93C5FD;
          text-decoration: none;
          font-size: 14px;
          font-weight: 850;
          margin-bottom: 30px;
        }

        .rp-topic-hero {
          display: grid;
          grid-template-columns: 86px 1fr;
          gap: 24px;
          align-items: start;
          margin-bottom: 42px;
        }

        .rp-topic-icon {
          width: 72px;
          height: 72px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(99,102,241,.25), rgba(6,182,212,.12));
          border: 1px solid rgba(129,140,248,.28);
          font-size: 34px;
        }

        .rp-badge {
          display: inline-flex;
          padding: 7px 13px;
          border-radius: 999px;
          background: rgba(99,102,241,.14);
          border: 1px solid rgba(99,102,241,.28);
          color: #C7D2FE;
          font-size: 13px;
          font-weight: 850;
          margin-bottom: 18px;
        }

        .rp-topic-hero h1 {
          font-size: clamp(42px, 7vw, 78px);
          line-height: .98;
          letter-spacing: -0.075em;
          font-weight: 950;
          margin: 0 0 20px;
        }

        .rp-topic-hero p {
          color: #CBD5E1;
          font-size: 19px;
          line-height: 1.75;
          max-width: 840px;
          margin: 0 0 28px;
        }

        .rp-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .rp-actions a,
        .rp-cta a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 850;
        }

        .rp-actions a:first-child,
        .rp-cta a:first-child {
          background: #6366F1;
          color: #fff;
          box-shadow: 0 14px 34px rgba(99,102,241,.32);
        }

        .rp-actions a:last-child,
        .rp-cta a:last-child {
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
          color: #E2E8F0;
        }

        .rp-overview-grid {
          display: grid;
          grid-template-columns: 1.4fr .6fr;
          gap: 18px;
          margin-bottom: 34px;
        }

        .rp-overview-card,
        .rp-stat-card,
        .rp-pearls,
        .rp-empty,
        .rp-cta {
          background: rgba(18,25,43,.9);
          border: 1px solid rgba(148,163,184,.16);
          border-radius: 26px;
          box-shadow: 0 18px 44px rgba(0,0,0,.26);
        }

        .rp-overview-card {
          padding: 30px;
        }

        .rp-eyebrow,
        .rp-section-head p {
          margin: 0 0 8px;
          color: #A5B4FC;
          text-transform: uppercase;
          letter-spacing: .12em;
          font-size: 12px;
          font-weight: 900;
        }

        .rp-overview-card h2,
        .rp-section-head h2,
        .rp-cta h2 {
          margin: 0 0 14px;
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.1;
          letter-spacing: -0.05em;
        }

        .rp-overview-card p,
        .rp-empty p,
        .rp-cta p {
          color: #CBD5E1;
          line-height: 1.8;
          font-size: 17px;
          margin: 0;
        }

        .rp-stat-card {
          padding: 24px;
          display: grid;
          gap: 14px;
        }

        .rp-stat-card div {
          padding: 16px;
          border-radius: 18px;
          background: rgba(15,23,42,.58);
          border: 1px solid rgba(148,163,184,.13);
        }

        .rp-stat-card span {
          display: block;
          font-size: 34px;
          font-weight: 950;
          color: #fff;
          line-height: 1;
        }

        .rp-stat-card p {
          margin: 6px 0 0;
          color: #94A3B8;
          font-size: 13px;
          font-weight: 750;
        }

        .rp-pearls {
          padding: 30px;
          margin-bottom: 34px;
        }

        .rp-pearl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px;
        }

        .rp-pearl {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-radius: 18px;
          background: rgba(15,23,42,.58);
          border: 1px solid rgba(148,163,184,.13);
        }

        .rp-pearl span {
          color: #22C55E;
          font-weight: 950;
        }

        .rp-pearl p {
          margin: 0;
          color: #DBEAFE;
          line-height: 1.6;
          font-size: 15px;
        }

        .rp-section {
          margin-top: 34px;
        }

        .rp-section-head {
          margin-bottom: 18px;
        }

        .rp-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 16px;
        }

        .rp-card {
          text-decoration: none;
          color: inherit;
        }

        .rp-card article,
        .rp-question-card {
          height: 100%;
          background: rgba(18,25,43,.9);
          border: 1px solid rgba(148,163,184,.16);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 18px 44px rgba(0,0,0,.24);
          transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }

        .rp-card:hover article,
        .rp-question-card:hover {
          transform: translateY(-3px);
          border-color: rgba(129,140,248,.42);
          background: rgba(22,31,53,.95);
        }

        .rp-mini-icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(99,102,241,.16);
          border: 1px solid rgba(129,140,248,.24);
          margin-bottom: 16px;
          font-size: 22px;
        }

        .rp-card h3,
        .rp-question-card h3 {
          font-size: 23px;
          line-height: 1.18;
          letter-spacing: -0.035em;
          margin: 0 0 12px;
        }

        .rp-card p,
        .rp-question-card p {
          color: #94A3B8;
          line-height: 1.7;
          font-size: 15px;
          margin: 0 0 18px;
        }

        .rp-card strong,
        .rp-question-card a {
          color: #93C5FD;
          font-weight: 900;
          text-decoration: none;
        }

        .rp-question-list {
          display: grid;
          gap: 14px;
        }

        .rp-question-top {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .rp-question-top span {
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(99,102,241,.14);
          border: 1px solid rgba(99,102,241,.25);
          color: #C7D2FE;
          font-size: 12px;
          font-weight: 850;
          text-transform: capitalize;
        }

        .rp-empty {
          padding: 28px;
        }

        .rp-empty h3 {
          margin: 0 0 10px;
          font-size: 24px;
        }

        .rp-empty a {
          display: inline-flex;
          margin-top: 18px;
          color: #93C5FD;
          font-weight: 900;
          text-decoration: none;
        }

        .rp-cta {
          margin-top: 38px;
          padding: 34px;
          background: linear-gradient(135deg, rgba(99,102,241,.16), rgba(6,182,212,.08));
          border-color: rgba(129,140,248,.24);
        }

        .rp-cta div {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        @media (max-width: 800px) {
          .rp-topic-main {
            padding: 54px 16px 78px;
          }

          .rp-topic-hero {
            grid-template-columns: 1fr;
          }

          .rp-overview-grid {
            grid-template-columns: 1fr;
          }

          .rp-topic-hero p {
            font-size: 17px;
          }
        }
      `}</style>
    </main>
  )
}

function getTopicIcon(name: string) {
  const n = name.toLowerCase()

  if (n.includes("stroke")) return "🧠"
  if (n.includes("brain") || n.includes("tbi")) return "⚡"
  if (n.includes("spinal") || n.includes("sci")) return "🦴"
  if (n.includes("parkinson") || n.includes("movement")) return "🚶"
  if (n.includes("multiple sclerosis")) return "🧬"
  if (n.includes("als")) return "🫁"
  if (n.includes("orthopedic")) return "🦵"
  if (n.includes("pediatric")) return "👶"

  return "💎"
}