import { NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { getSupabaseServerClient } from '@/src/lib/supabase';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { path } = await request.json().catch(() => ({}));
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from('profiles')
    .upsert({ email: session.user.email, avatar_path: path, updated_at: new Date().toISOString() }, { onConflict: 'email' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}