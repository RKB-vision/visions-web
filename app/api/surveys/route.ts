import { NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { getSupabaseServerClient } from '@/src/lib/supabase';

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from('survey_responses').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const { name, email, rating, feedback } = body;
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
  }

  const session = await auth();
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from('survey_responses').insert({
    name: typeof name === 'string' ? name : null,
    email: typeof email === 'string' ? email : null,
    rating,
    feedback: typeof feedback === 'string' ? feedback : null,
    user_email: session?.user?.email ?? null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}