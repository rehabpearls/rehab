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
  "https://www.medicalnewstoday.com/rss",
  "https://www.news-medical.net/tag/feed/Physical-Therapy.xml",
  "https://www.news-medical.net/tag/feed/Rehabilitation.xml",
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
        "User-Agent": "RehabPearlsBot/1.0",
      },
      next: { revalidate: 3600 },
    })

    const xml = await res.text()

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]

    return items.slice(0, 5).map((item) => {
      const block = item[1] || ""

      const title =
        block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
        block.match(/<title>(.*?)<\/title>/)?.[1] ||
        ""

      const description =
        block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
        block.match(/<description>(.*?)<\/description>/)?.[1] ||
        ""

      const link = block.match(/<link>(.*?)<\/link>/)?.[1] || ""

      return {
        title: stripHtml(title),
        description: stripHtml(description),
        link,
      }
    })
  } catch (e) {
    console.error("RSS ERROR:", url, e)
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

    for (const source of RSS_SOURCES) {
      const items = await fetchRSS(source)
      allNews.push(...items)
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
      generated: results.length,
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