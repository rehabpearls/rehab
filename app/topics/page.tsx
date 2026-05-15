import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Rehab Topics: Neuro, Ortho, PT, OT & SLP Study Tracks | RehabPearls",
  description:
    "Explore structured rehabilitation topics for physical therapy, occupational therapy, speech therapy, neuro rehab, orthopedic rehab, board exam prep, and clinical reasoning.",
  alternates: {
    canonical: "https://rehabpearls.com/topics",
  },
  openGraph: {
    title: "Rehab Topics | RehabPearls",
    description:
      "Structured rehab learning topics for PT, OT, SLP, clinical reasoning, and board-style exam preparation.",
    url: "https://rehabpearls.com/topics",
    siteName: "RehabPearls",
    type: "website",
  },
}

type Topic = {
  id: string
  name: string
  slug: string
  short_description: string | null
  seo_title: string | null
  seo_description: string | null
  icon: string | null
  order_index: number | null
  topic_groups?: {
    name: string
    slug: string
  } | null
}

export default async function TopicsPage() {
  const supabase = await createClient()

  const { data: topics } = await supabase
    .from("topics")
    .select(`
      id,
      name,
      slug,
      short_description,
      seo_title,
      seo_description,
      icon,
      order_index,
      topic_groups (
        name,
        slug
      )
    `)
    .is("parent_topic_id", null)
    .order("order_index", { ascending: true })
    .order("name", { ascending: true })

  const topicList = (topics || []) as Topic[]

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Rehab Topics",
    url: "https://rehabpearls.com/topics",
    description:
      "Structured rehabilitation learning topics for PT, OT, SLP, neuro rehab, orthopedic rehab, clinical reasoning, and board exam preparation.",
    publisher: {
      "@type": "Organization",
      name: "RehabPearls",
      url: "https://rehabpearls.com",
    },
    mainEntity: topicList.map((topic) => ({
      "@type": "EducationalOccupationalProgram",
      name: topic.name,
      description: topic.short_description || topic.seo_description,
      url: `https://rehabpearls.com/topics/${topic.slug}`,
    })),
  }

  return (
    <main className="rp-topics-main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="rp-hero">
        <div className="rp-badge">Rehab Knowledge Map</div>

        <h1>Rehabilitation Topics</h1>

        <p>
          Explore structured rehab learning tracks across neuro rehab,
          orthopedic rehabilitation, physical therapy, occupational therapy,
          speech therapy, clinical reasoning, and board-style exam preparation.
        </p>

        <div className="rp-actions">
          <Link href="/qbank">Start QBank Practice →</Link>
          <Link href="/guides">View Study Guides</Link>
        </div>
      </section>

      <section className="rp-keyword-strip">
        {[
          "Neuro Rehab",
          "Stroke",
          "TBI",
          "SCI",
          "Parkinson Disease",
          "Multiple Sclerosis",
          "ALS",
          "Orthopedic Rehab",
          "Clinical Reasoning",
          "Board Exam Prep",
        ].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="rp-topics-wrap">
        <div className="rp-section-head">
          <p>Learning Tracks</p>
          <h2>Choose a clinical topic to study</h2>
        </div>

        <div className="rp-topic-grid">
          {topicList.map((topic, index) => (
            <Link
              href={`/topics/${topic.slug}`}
              key={topic.id}
              className="rp-topic-card"
            >
              <article>
                <div className="rp-card-top">
                  <div className="rp-icon">
                    {topic.icon || getTopicIcon(topic.name)}
                  </div>

                  <span>
                    {topic.topic_groups?.name || "Rehab Topic"}
                  </span>
                </div>

                <h3>{topic.name}</h3>

                <p>
                  {topic.short_description ||
                    topic.seo_description ||
                    "Study high-yield rehabilitation concepts, clinical reasoning, board exam pearls, and practical therapy applications."}
                </p>

                <div className="rp-meta-row">
                  <span>Clinical Learning</span>
                  <span>Track {index + 1}</span>
                </div>

                <div className="rp-read">Open topic →</div>
              </article>
            </Link>
          ))}
        </div>

        {!topicList.length && (
          <div className="rp-empty">
            <h2>No topics yet</h2>
            <p>
              Add topics in Supabase to build your rehab knowledge map.
            </p>
          </div>
        )}
      </section>

      <section className="rp-seo-block">
        <h2>Built for rehabilitation science and board-style learning</h2>
        <p>
          RehabPearls topics organize rehabilitation education into a scalable
          clinical knowledge map. Students and clinicians can study neurological
          rehabilitation, stroke recovery, traumatic brain injury, spinal cord
          injury, Parkinson disease, multiple sclerosis, ALS, orthopedic rehab,
          pediatric therapy, and evidence-based clinical reasoning.
        </p>
      </section>

      <style>{`
        .rp-topics-main {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 0%, rgba(99,102,241,.16), transparent 32%),
            radial-gradient(circle at 90% 12%, rgba(6,182,212,.10), transparent 28%),
            #0B1020;
          color: #F8FAFC;
          padding: 72px 24px 96px;
        }

        .rp-hero {
          max-width: 1120px;
          margin: 0 auto 34px;
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
          margin-bottom: 22px;
        }

        .rp-hero h1 {
          font-size: clamp(48px, 8vw, 92px);
          line-height: .95;
          letter-spacing: -0.075em;
          font-weight: 950;
          margin: 0 0 22px;
        }

        .rp-hero p {
          color: #CBD5E1;
          font-size: 20px;
          line-height: 1.75;
          max-width: 860px;
          margin: 0 0 30px;
        }

        .rp-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .rp-actions a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 850;
        }

        .rp-actions a:first-child {
          background: #6366F1;
          color: #fff;
          box-shadow: 0 14px 34px rgba(99,102,241,.32);
        }

        .rp-actions a:last-child {
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
          color: #E2E8F0;
        }

        .rp-keyword-strip {
          max-width: 1120px;
          margin: 0 auto 42px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .rp-keyword-strip span {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.055);
          border: 1px solid rgba(255,255,255,.08);
          color: #CBD5E1;
          font-size: 13px;
          font-weight: 750;
        }

        .rp-topics-wrap {
          max-width: 1120px;
          margin: 0 auto;
        }

        .rp-section-head {
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

        .rp-topic-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
          gap: 18px;
        }

        .rp-topic-card {
          text-decoration: none;
          color: inherit;
        }

        .rp-topic-card article {
          height: 100%;
          background: rgba(18,25,43,.9);
          border: 1px solid rgba(148,163,184,.16);
          border-radius: 26px;
          padding: 26px;
          box-shadow: 0 18px 44px rgba(0,0,0,.28);
          transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }

        .rp-topic-card:hover article {
          transform: translateY(-3px);
          border-color: rgba(129,140,248,.42);
          background: rgba(22,31,53,.95);
        }

        .rp-card-top {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: center;
          margin-bottom: 20px;
        }

        .rp-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(99,102,241,.24), rgba(6,182,212,.12));
          border: 1px solid rgba(129,140,248,.26);
          font-size: 23px;
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

        .rp-topic-card h3 {
          font-size: 28px;
          line-height: 1.14;
          letter-spacing: -0.04em;
          margin: 0 0 14px;
        }

        .rp-topic-card p {
          color: #94A3B8;
          line-height: 1.75;
          font-size: 16px;
          margin: 0;
        }

        .rp-meta-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .rp-meta-row span {
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(15,23,42,.65);
          border: 1px solid rgba(148,163,184,.13);
          color: #CBD5E1;
          font-size: 12px;
          font-weight: 700;
        }

        .rp-read {
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

        .rp-seo-block {
          max-width: 1120px;
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
          max-width: 940px;
          margin: 0;
        }

        @media (max-width: 700px) {
          .rp-topics-main {
            padding: 54px 16px 78px;
          }

          .rp-hero p {
            font-size: 17px;
          }

          .rp-topic-card h3 {
            font-size: 24px;
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