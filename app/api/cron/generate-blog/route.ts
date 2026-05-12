import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

type NewsItem = {
  title: string
  description: string
  link: string
  source: string
}

type GeneratedArticle = {
  title: string
  excerpt: string
  content: string
  meta_title: string
  meta_description: string
  keywords: string[]
  faq?: { question: string; answer: string }[]
  category?: string
}

function getSupabaseAdmin() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"]
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"]

  if (!url || !key) throw new Error("Missing Supabase admin env variables")

  return createClient(url, key)
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90)
}

function stripHtml(input: string) {
  return (input || "")
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function safeJsonParse(text: string): GeneratedArticle | null {
  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim()

    const start = cleaned.indexOf("{")
    const end = cleaned.lastIndexOf("}")

    if (start === -1 || end === -1) return null

    return JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    return null
  }
}

async function fetchPubMedArticles(): Promise<NewsItem[]> {
  try {
    const query = encodeURIComponent(
      'rehabilitation OR "physical therapy" OR "occupational therapy" OR "speech therapy" OR neurorehabilitation OR "stroke rehabilitation" OR "pediatric rehabilitation"'
    )

    const searchUrl =
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&retmode=json&retmax=12&sort=pub+date`

    const searchRes = await fetch(searchUrl, {
      cache: "no-store",
      headers: {
        "User-Agent": "RehabPearlsBot/1.0",
      },
    })

    if (!searchRes.ok) return []

    const searchData = await searchRes.json()
    const ids: string[] = searchData?.esearchresult?.idlist || []

    if (!ids.length) return []

    const summaryUrl =
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`

    const summaryRes = await fetch(summaryUrl, {
      cache: "no-store",
      headers: {
        "User-Agent": "RehabPearlsBot/1.0",
      },
    })

    if (!summaryRes.ok) return []

    const summaryData = await summaryRes.json()

    return ids
      .map((id) => {
        const item = summaryData?.result?.[id]

        return {
          title: stripHtml(item?.title || ""),
          description: item?.fulljournalname
            ? `Recent rehabilitation research published in ${item.fulljournalname}.`
            : "Recent rehabilitation research publication from PubMed.",
          link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          source: "PubMed",
        }
      })
      .filter((item) => item.title && item.link)
  } catch (e) {
    console.error("PUBMED ERROR:", e)
    return []
  }
}

function fallbackTopics(): NewsItem[] {
  return [
    {
      title: "Clinical Reasoning Strategies for Physical Therapy and Rehabilitation Students",
      description:
        "Educational RehabPearls topic focused on clinical reasoning, board-style exam preparation, and real-world rehabilitation decision-making.",
      link: "https://rehabpearls.com/guides",
      source: "RehabPearls Editorial",
    },
    {
      title: "How Neurorehabilitation Principles Support Stroke Recovery and Functional Outcomes",
      description:
        "Educational topic covering stroke rehabilitation, neuroplasticity, gait, balance, patient safety, and functional recovery.",
      link: "https://rehabpearls.com/cases/neuro",
      source: "RehabPearls Editorial",
    },
    {
      title: "Orthopedic Rehabilitation Progression: From Pain Control to Return to Function",
      description:
        "Educational topic covering orthopedic rehab, exercise progression, patient management, and board-style clinical reasoning.",
      link: "https://rehabpearls.com/cases/orthopedic",
      source: "RehabPearls Editorial",
    },
  ]
}

function buildInternalLinksBlock() {
  return `
## Continue Learning with RehabPearls

Explore related rehab learning resources:

- Practice board-style questions in the [RehabPearls QBank](/qbank)
- Read more clinical learning resources in the [Rehab Guides](/guides)
- Review neurological rehabilitation cases in [Neuro Rehab Cases](/cases/neuro)
- Study orthopedic patient scenarios in [Orthopedic Rehab Cases](/cases/orthopedic)
- Browse pediatric therapy examples in [Pediatric Rehab Cases](/cases/pediatrics)
`
}

async function generateArticle(news: NewsItem): Promise<GeneratedArticle | null> {
  const apiKey = process.env["GEMINI_API_KEY"]
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY")

  const prompt = `
You are a senior medical education editor for RehabPearls.com.

Write an ORIGINAL, high-quality, SEO-focused educational article for:
- physical therapy students
- occupational therapy students
- speech-language pathology students
- rehabilitation clinicians

Use the source/topic only as background. Do not copy wording. Do not present this as medical advice.

Required style:
- Professional, human, non-generic writing
- Strong clinical education value
- Practical rehab implications
- Board-style exam relevance
- Clear headings
- FAQ section
- Natural internal linking opportunities
- Avoid AI clichés like "delve", "unlock", "in today's fast-paced world"

Target SEO keywords:
physical therapy, occupational therapy, speech therapy, rehabilitation, clinical reasoning, rehab education, board exam prep, evidence-based rehab, neurorehabilitation, orthopedic rehabilitation, pediatric therapy

Source/topic:
Title: ${news.title}
Description: ${news.description}
URL: ${news.link}
Source: ${news.source}

Return VALID JSON ONLY with this shape:
{
  "title": "SEO optimized title",
  "excerpt": "Short compelling excerpt, 150-180 characters",
  "content": "Markdown article with H2 headings, bullet points, practical takeaways, and FAQ section",
  "meta_title": "SEO title under 60 characters",
  "meta_description": "SEO meta description under 155 characters",
  "keywords": ["keyword 1", "keyword 2"],
  "category": "neuro-rehab | orthopedic-rehab | pediatric-therapy | exam-prep | clinical-reasoning",
  "faq": [
    {"question": "Question?", "answer": "Answer."}
  ]
}
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.72,
          topP: 0.9,
          maxOutputTokens: 8192,
        },
      }),
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error("GEMINI ERROR:", response.status, errorText)
    return null
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
  const parsed = safeJsonParse(text)

  if (!parsed?.title || !parsed?.content) {
    console.error("GEMINI INVALID JSON:", text.slice(0, 500))
    return null
  }

  parsed.content = `${parsed.content}\n\n${buildInternalLinksBlock()}`
  parsed.keywords = Array.isArray(parsed.keywords) ? parsed.keywords : []

  return parsed
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")

    if (
      process.env["CRON_SECRET"] &&
      authHeader !== `Bearer ${process.env["CRON_SECRET"]}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()
    const sourceDebug: any[] = []

    let newsItems = await fetchPubMedArticles()

    sourceDebug.push({
      source: "PubMed",
      count: newsItems.length,
      sample: newsItems[0] || null,
    })

    if (!newsItems.length) {
      newsItems = fallbackTopics()

      sourceDebug.push({
        source: "RehabPearls Editorial Fallback",
        count: newsItems.length,
        sample: newsItems[0] || null,
      })
    }

    const uniqueNews = Array.from(
      new Map(newsItems.map((item) => [item.title, item])).values()
    )

    const results = []
    const skipped = []

    for (const news of uniqueNews.slice(0, 3)) {
      const article = await generateArticle(news)

      if (!article?.title || !article?.content) {
        skipped.push({ title: news.title, reason: "AI generation failed" })
        continue
      }

      const baseSlug = slugify(article.title)
      const slug = `${baseSlug}-${new Date().toISOString().slice(0, 10)}`

      const { data: existing } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", slug)
        .maybeSingle()

      if (existing) {
        skipped.push({ title: article.title, reason: "already exists" })
        continue
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .insert([
          {
            title: article.title,
            slug,
            excerpt: article.excerpt,
            content: article.content,
            meta_title: article.meta_title,
            meta_description: article.meta_description,
            keywords: article.keywords,
            source_urls: [news.link],
            status: "published",
            published_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        skipped.push({
          title: article.title,
          reason: error.message,
        })
        continue
      }

      results.push(data)
    }

    return NextResponse.json({
      success: true,
      fetched: newsItems.length,
      generated: results.length,
      sourceDebug,
      skipped,
      posts: results.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
      })),
    })
  } catch (e: any) {
    console.error("GENERATE BLOG ERROR:", e)

    return NextResponse.json(
      {
        success: false,
        error: e.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}