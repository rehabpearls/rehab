// app/api/cron/generate-blog/route.ts

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// ─────────────────────────────────────────────────────────────
// ENV
// ─────────────────────────────────────────────────────────────

function getSupabaseAdmin() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"]
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"]

  if (!url || !key) {
    throw new Error("Missing Supabase admin env variables")
  }

  return createClient(url, key)
}

const GEMINI_API_KEY = process.env["GEMINI_API_KEY"]!

// ─────────────────────────────────────────────────────────────
// RSS SOURCES
// ─────────────────────────────────────────────────────────────

const RSS_SOURCES = [
  "https://www.cdc.gov/media/rss.xml",
  "https://medlineplus.gov/feeds/news_en.xml",
  "https://www.sciencedaily.com/rss/health_medicine/rehabilitation.xml",
  "https://medicalxpress.com/rss-feed/medicine-health-news/",
]
// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim()
}

async function fetchRSS(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 RehabPearlsBot/1.0",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("RSS HTTP ERROR:", url, res.status)
      return []
    }

    const xml = await res.text()

    const rawItems = [
      ...[...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((m) => m[1] || ""),
      ...[...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map((m) => m[1] || ""),
    ]

    return rawItems.slice(0, 6).map((block) => {
      const title =
        block.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>/i)?.[1] ||
        block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ||
        ""

      const description =
        block.match(/<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>/i)?.[1] ||
        block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ||
        block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ||
        ""

      const link =
        block.match(/<link[^>]*>(.*?)<\/link>/i)?.[1] ||
        block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i)?.[1] ||
        ""

      return {
        title: stripHtml(title).replace(/&amp;/g, "&"),
        description: stripHtml(description).replace(/&amp;/g, "&"),
        link: stripHtml(link),
      }
    }).filter((item) => item.title && item.link)
  } catch (e) {
    console.error("RSS ERROR:", url, e)
    return []
  }
}
async function fetchGdeltNews() {
  try {
    const query = encodeURIComponent(
      '(rehabilitation OR "physical therapy" OR "occupational therapy" OR "speech therapy" OR physiotherapy OR "stroke recovery" OR "clinical rehabilitation")'
    )

    const url =
      `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=ArtList&format=json&maxrecords=10&sort=HybridRel`

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 RehabPearlsBot/1.0",
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("GDELT HTTP ERROR:", res.status)
      return []
    }

    const data = await res.json()

    return (data.articles || []).map((a: any) => ({
      title: a.title || "",
      description: a.seendate ? `Published ${a.seendate}. Source: ${a.sourceCountry || "medical news"}.` : "",
      link: a.url || "",
    })).filter((item: any) => item.title && item.link)
  } catch (e) {
    console.error("GDELT ERROR:", e)
    return []
  }
}
// ─────────────────────────────────────────────────────────────
// GEMINI GENERATION
// ─────────────────────────────────────────────────────────────

async function generateArticle(news: {
  title: string
  description: string
  link: string
}) {
  const prompt = `
You are an expert medical SEO editor writing for RehabPearls.com.

Create a HIGH-QUALITY ORIGINAL educational article for:
- physical therapy students
- occupational therapy students
- speech-language pathology students
- rehabilitation clinicians

IMPORTANT:
- DO NOT copy the source article.
- Use the source only as inspiration/background.
- Create completely original wording.
- Strong SEO optimization.
- Human-like writing.
- Educational + clinical style.
- Include rehab implications.
- Include practical takeaways.
- Include FAQ section.
- Include headings.
- Include strong keywords naturally.

TARGET KEYWORDS:
physical therapy
occupational therapy
speech therapy
rehabilitation
clinical reasoning
rehab education
board exam prep
evidence-based rehab

SOURCE TITLE:
${news.title}

SOURCE DESCRIPTION:
${news.description}

SOURCE URL:
${news.link}

RETURN JSON ONLY:

{
  "title": "",
  "excerpt": "",
  "content": "",
  "meta_title": "",
  "meta_description": "",
  "keywords": ["",""],
  "faq": [
    {
      "question": "",
      "answer": ""
    }
  ]
}
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    }
  )

  const data = await response.json()

  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}"

  try {
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, ""))
  } catch (e) {
    console.error("JSON PARSE ERROR", text)
    return null
  }
}

// ─────────────────────────────────────────────────────────────
// ROUTE
// ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    // SECURITY
    const authHeader = req.headers.get("authorization")

    if (
      process.env["CRON_SECRET"] &&
      authHeader !== `Bearer ${process.env["CRON_SECRET"]}`
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // FETCH NEWS
let allNews: any[] = []
const sourceDebug: any[] = []

for (const source of RSS_SOURCES) {
  const items = await fetchRSS(source)

  sourceDebug.push({
    source,
    type: "rss",
    count: items.length,
    sample: items[0] || null,
  })

  allNews.push(...items)
}

if (allNews.length === 0) {
  const gdeltItems = await fetchGdeltNews()

  sourceDebug.push({
    source: "GDELT",
    type: "gdelt",
    count: gdeltItems.length,
    sample: gdeltItems[0] || null,
  })

  allNews.push(...gdeltItems)
}

    // REMOVE DUPLICATES
    const uniqueNews = Array.from(
      new Map(allNews.map((n) => [n.title, n])).values()
    )

    const results = []

    // GENERATE POSTS
    for (const news of uniqueNews.slice(0, 3)) {
      const article = await generateArticle(news)

      if (!article?.title || !article?.content) continue

      const slug = slugify(article.title)

      // CHECK EXISTING
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", slug)
        .maybeSingle()

      if (existing) {
        console.log("ALREADY EXISTS:", slug)
        continue
      }

      // SAVE
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
            keywords: article.keywords || [],
            source_urls: [news.link],
            status: "draft",
            published_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error(error)
        continue
      }

      results.push(data)
    }

   return NextResponse.json({
  success: true,
  fetched: allNews.length,
  unique: uniqueNews.length,
  generated: results.length,
  sourceDebug,
  sampleNews: uniqueNews.slice(0, 3),
  posts: results,
})
  } catch (e: any) {
    console.error(e)

    return NextResponse.json(
      {
        success: false,
        error: e.message,
      },
      {
        status: 500,
      }
    )
  }
}