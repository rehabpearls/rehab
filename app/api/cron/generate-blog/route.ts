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

type AiArticle = {
  title: string
  content: string
  meta_description: string
  focus_keyword: string
  excerpt: string
  keywords?: string[]
}

const OPENROUTER_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-3-27b-it:free",
]

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function cleanAiJson(raw: string) {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()
}

function safeParseAiArticle(raw: string): AiArticle | null {
  try {
    const cleaned = cleanAiJson(raw)
    const start = cleaned.indexOf("{")
    const end = cleaned.lastIndexOf("}")

    if (start === -1 || end === -1) return null

    const parsed = JSON.parse(cleaned.slice(start, end + 1))

    if (!parsed?.title || !parsed?.content) return null

    return parsed
  } catch {
    return null
  }
}

function appendInternalLinksBlock(content: string) {
  if (content.includes("rehabpearls-internal-links")) return content

  return `${content}

<div class="rehabpearls-internal-links" style="margin-top:32px;padding:22px;border:1px solid #243041;border-radius:16px;background:#12192B;">
  <h2>Continue Learning with RehabPearls</h2>
  <p>Build stronger clinical reasoning with our <a href="/qbank">rehab question bank</a>, explore expert <a href="/guides">rehab study guides</a>, review <a href="/cases/neuro">neuro rehab cases</a>, practice with <a href="/cases/orthopedic">orthopedic rehabilitation cases</a>, and study <a href="/cases/pediatrics">pediatric therapy cases</a>.</p>
</div>`
}

async function fetchPubMedArticles(): Promise<NewsItem[]> {
  try {
    const query = encodeURIComponent(
      'rehabilitation OR "physical therapy" OR "occupational therapy" OR "speech therapy" OR neurorehabilitation OR "stroke rehabilitation" OR "orthopedic rehabilitation" OR "pediatric rehabilitation"'
    )

    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&retmode=json&retmax=12&sort=pub+date`

    const searchRes = await fetch(searchUrl, {
      cache: "no-store",
      headers: { "User-Agent": "RehabPearlsBot/1.0" },
    })

    if (!searchRes.ok) return []

    const searchData = await searchRes.json()
    const ids: string[] = searchData?.esearchresult?.idlist || []

    if (!ids.length) return []

    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`

    const summaryRes = await fetch(summaryUrl, {
      cache: "no-store",
      headers: { "User-Agent": "RehabPearlsBot/1.0" },
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

function createFallbackSeoArticle(news: NewsItem): AiArticle {
  const title = `${news.title}: Rehab Education and Clinical Reasoning Guide`

  const content = `
<p>${news.title} connects directly to how rehabilitation students and clinicians think about patient care, clinical reasoning, and evidence-based rehab practice. For physical therapy, occupational therapy, and speech therapy learners, topics like this can help connect research awareness with practical decision-making.</p>

<h2>Why This Topic Matters in Rehabilitation</h2>
<p>Rehabilitation is not only about memorizing facts. Strong clinicians learn how to interpret patient presentation, connect impairments with function, and choose interventions that match the patient’s goals, safety needs, and recovery stage.</p>

<h2>Clinical Reasoning Takeaways</h2>
<ul>
  <li><strong>Physical therapy:</strong> consider movement, strength, balance, pain, mobility, and return-to-function planning.</li>
  <li><strong>Occupational therapy:</strong> consider ADLs, participation, safety, cognition, home routines, and functional independence.</li>
  <li><strong>Speech therapy:</strong> consider communication, swallowing, cognition, patient education, and interdisciplinary care.</li>
  <li><strong>Board exam prep:</strong> focus on patient safety, prioritization, contraindications, and evidence-based decisions.</li>
</ul>

<h2>How Students Can Study This Topic</h2>
<p>Use this topic as a starting point for board-style questions, clinical cases, and scenario-based learning. The key is to ask: what is the patient problem, what information matters most, and what intervention is safest and most effective?</p>

<h2>Practical Rehab Application</h2>
<p>For rehab professionals, research headlines should become practical questions: how does this affect assessment, treatment planning, patient education, progression, and discharge recommendations?</p>

<h2>FAQ</h2>
<h3>Is this medical advice?</h3>
<p>No. RehabPearls content is for education and exam preparation only.</p>

<h3>How does this help with board exam prep?</h3>
<p>It helps students practice clinical reasoning, identify key patient factors, and connect evidence-based rehab concepts with realistic scenarios.</p>

<h3>Where should I practice more?</h3>
<p>Use the <a href="/qbank">RehabPearls QBank</a>, read <a href="/guides">rehab study guides</a>, and review <a href="/cases/neuro">neuro rehab cases</a>, <a href="/cases/orthopedic">orthopedic cases</a>, and <a href="/cases/pediatrics">pediatric therapy cases</a>.</p>
`

  return {
    title,
    content: appendInternalLinksBlock(content),
    meta_description:
      "Explore rehab clinical reasoning, physical therapy, occupational therapy, speech therapy, and board exam prep insights.",
    focus_keyword: "rehabilitation clinical reasoning",
    excerpt:
      "A rehab education guide connecting current research topics with clinical reasoning, board exam prep, and practical therapy learning.",
    keywords: [
      "physical therapy",
      "occupational therapy",
      "speech therapy",
      "rehabilitation",
      "clinical reasoning",
      "board exam prep",
      "evidence-based rehab",
      "rehab education",
      "neurorehabilitation",
      "orthopedic rehabilitation",
      "pediatric therapy",
    ],
  }
}

async function callOpenRouter(prompt: string, apiKey: string) {
  let lastError = ""

  for (const model of OPENROUTER_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://rehabpearls.com",
          "X-Title": "RehabPearls AI Blog",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.45,
        }),
      })

      const rawBody = await response.text()

      if (response.ok) {
        try {
          const body = JSON.parse(rawBody)
          const aiText = body?.choices?.[0]?.message?.content || ""
          if (aiText) return { aiText, model }
        } catch {
          lastError = `Parse failed for ${model}: ${rawBody.slice(0, 500)}`
        }
      } else {
        lastError = `${model} failed ${response.status}: ${rawBody.slice(0, 500)}`
        console.error("OPENROUTER ERROR:", lastError)

        if (response.status === 429 && attempt < 3) {
          await sleep(12000)
          continue
        }

        break
      }
    }
  }

  console.error("OPENROUTER FINAL ERROR:", lastError)
  return null
}

async function generateArticle(news: NewsItem): Promise<AiArticle | null> {
  const apiKey = process.env["OPENROUTER_API_KEY"]
  if (!apiKey) throw new Error("Missing OPENROUTER_API_KEY")

  const prompt = `
You are a senior medical education SEO editor for RehabPearls.

Create a high-quality original educational article for:
- physical therapy students
- occupational therapy students
- speech-language pathology students
- rehabilitation clinicians
- board exam prep users

Main SEO keywords to use naturally:
physical therapy, occupational therapy, speech therapy, rehabilitation, clinical reasoning, board exam prep, evidence-based rehab, neurorehabilitation, orthopedic rehabilitation, pediatric therapy, rehab education, therapy students, clinical cases, rehab question bank.

Requirements:
- Do NOT copy source sentences.
- Do NOT claim medical advice.
- Make it professional, human, useful, and specific.
- Use clean HTML only: <p>, <h2>, <h3>, <strong>, <em>, <a>, <ul>, <li>.
- Include 4-6 H2 headings.
- Include practical rehab takeaways.
- Include clinical reasoning / board exam relevance.
- Include a short FAQ section with 3 questions.
- Add internal links naturally to /qbank, /guides, /cases/neuro, /cases/orthopedic, /cases/pediatrics.
- No markdown.
- No code fences.
- Return ONLY valid JSON.

JSON shape:
{
  "title": "SEO title here",
  "content": "<p>Intro...</p><h2>...</h2><p>...</p>",
  "meta_description": "155 character SEO meta description",
  "focus_keyword": "rehabilitation",
  "excerpt": "Short excerpt for blog archive",
  "keywords": ["physical therapy", "rehabilitation"]
}

Source title:
${news.title}

Source description:
${news.description}

Source URL:
${news.link}

Source name:
${news.source}
`

  const result = await callOpenRouter(prompt, apiKey)

  if (!result?.aiText) {
    return createFallbackSeoArticle(news)
  }

  const article = safeParseAiArticle(result.aiText)

  if (!article) {
    console.error("OPENROUTER JSON PARSE FAILED:", result.aiText.slice(0, 1000))
    return createFallbackSeoArticle(news)
  }

  article.content = appendInternalLinksBlock(article.content)
  article.keywords = Array.isArray(article.keywords) ? article.keywords : []

  return article
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

    for (const news of uniqueNews.slice(0, 1)) {
      const article = await generateArticle(news)

      if (!article?.title || !article?.content) {
        skipped.push({
          title: news.title,
          reason: "AI generation failed",
        })
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
        skipped.push({
          title: article.title,
          reason: "already exists",
        })
        continue
      }

      const { data, error } = await supabase
        .from("blog_posts")
        .insert([
          {
            title: stripHtml(article.title),
            slug,
            excerpt: stripHtml(article.excerpt || ""),
            content: article.content,
            meta_title: stripHtml(article.title),
            meta_description: stripHtml(article.meta_description || ""),
            keywords: article.keywords || [],
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