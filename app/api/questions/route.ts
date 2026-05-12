import { NextResponse } from 'next/server';
import { createBrowserClient } from "@supabase/ssr"
 //
const supabase = createBrowserClient(
  process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
  process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!
)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const limit = parseInt(searchParams.get('limit') || '10');

  let query = supabase.from('questions').select('*').limit(limit);

  if (category) query = query.eq('category', category);
  if (difficulty) query = query.eq('difficulty', difficulty);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

