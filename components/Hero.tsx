import Link from "next/link"

interface HeroProps {
  title?: string
  subtitle?: string
  cta1Label?: string
  cta1Href?: string
  cta2Label?: string
  cta2Href?: string
  variant?: "default" | "pricing" | "about"
  showStats?: boolean
}

export default function Hero({
  title = "Master NPTE & Board Exams With Clinical Reasoning",
  subtitle = "Adaptive QBank, real clinical cases, and evidence-based explanations built for PT, OT, and SLP exam success.",
  cta1Label = "Start Free Trial",
  cta1Href = "/register",
  cta2Label = "Explore QBank",
  cta2Href = "/qbank",
  variant = "default",
  showStats = true,
}: HeroProps) {
  const gradients = {
    default: "linear-gradient(135deg, #0f172a 0%, #123458 48%, #0f766e 100%)",
    pricing: "linear-gradient(135deg, #111827 0%, #1e3a8a 55%, #0f766e 100%)",
    about: "linear-gradient(135deg, #0f172a 0%, #334155 55%, #155e75 100%)",
  }

  const stats = [
    ["4,000+", "Board-style questions"],
    ["150+", "Clinical cases"],
    ["92%", "First-time pass rate"],
    ["4.9", "Average learner rating"],
  ]

  return (
    <section className="rp-hero" style={{ background: gradients[variant] }}>
      <style>{`
        .rp-hero {
          position: relative;
          overflow: hidden;
          color: white;
          padding: 88px 24px 72px;
        }

        .rp-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 18%, rgba(59, 130, 246, 0.24), transparent 32%),
            radial-gradient(circle at 82% 70%, rgba(20, 184, 166, 0.18), transparent 34%);
          pointer-events: none;
        }

        .rp-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
        }

        .rp-hero-copy {
          max-width: 780px;
        }

        .rp-hero-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          margin-bottom: 22px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          color: #dbeafe;
          font-size: 13px;
          font-weight: 700;
        }

        .rp-hero-title {
          margin: 0;
          max-width: 820px;
          font-size: clamp(42px, 6vw, 76px);
          line-height: 0.98;
          letter-spacing: -0.04em;
          font-weight: 900;
        }

        .rp-hero-accent {
          color: #67e8f9;
        }

        .rp-hero-subtitle {
          max-width: 660px;
          margin: 24px 0 0;
          color: #dbeafe;
          font-size: 20px;
          line-height: 1.65;
        }

        .rp-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 34px;
        }

        .rp-hero-primary,
        .rp-hero-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 24px;
          border-radius: 8px;
          font-weight: 800;
          text-decoration: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }

        .rp-hero-primary {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.24);
        }

        .rp-hero-primary:hover,
        .rp-hero-secondary:hover {
          transform: translateY(-2px);
        }

        .rp-hero-secondary {
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.34);
          background: rgba(255, 255, 255, 0.1);
        }

        .rp-hero-trust {
          margin-top: 18px;
          color: #bfdbfe;
          font-size: 14px;
          font-weight: 600;
        }

        .rp-hero-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 58px;
        }

        .rp-hero-stat {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.09);
        }

        .rp-hero-stat strong {
          display: block;
          font-size: 30px;
          line-height: 1;
          color: #ffffff;
        }

        .rp-hero-stat span {
          display: block;
          margin-top: 8px;
          color: #cbd5e1;
          font-size: 13px;
          font-weight: 600;
        }

        @media (max-width: 760px) {
          .rp-hero {
            padding: 64px 18px 48px;
          }

          .rp-hero-title {
            font-size: 40px;
          }

          .rp-hero-subtitle {
            font-size: 17px;
          }

          .rp-hero-actions {
            flex-direction: column;
          }

          .rp-hero-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>

      <div className="rp-hero-inner">
        <div className="rp-hero-copy">
          <div className="rp-hero-badge">Trusted by 15,000+ rehab learners</div>

          <h1 className="rp-hero-title">
            {title.includes("Clinical Reasoning") ? (
              <>
                {title.split("Clinical Reasoning")[0]}
                <span className="rp-hero-accent">Clinical Reasoning</span>
              </>
            ) : (
              title
            )}
          </h1>

          <p className="rp-hero-subtitle">{subtitle}</p>

          <div className="rp-hero-actions">
            <Link href={cta1Href} className="rp-hero-primary">
              {cta1Label}
            </Link>
            <Link href={cta2Href} className="rp-hero-secondary">
              {cta2Label}
            </Link>
          </div>

          <p className="rp-hero-trust">
            No credit card required. 7-day full access. Cancel anytime.
          </p>
        </div>

        {showStats && (
          <div className="rp-hero-stats">
            {stats.map(([value, label]) => (
              <div className="rp-hero-stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}