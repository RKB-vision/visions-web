import { NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { getSupabaseServerClient } from '@/src/lib/supabase';

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { fileName, contentType } = await request.json().catch(() => ({}));
  if (!fileName || !contentType) return NextResponse.json({ error: 'Missing fileName or contentType' }, { status: 400 });

  const supabase = getSupabaseServerClient();
  await supabase.storage.createBucket('avatars', { public: false }).catch(() => { /* ignore if exists */ });
  const path = `${session.user?.email}/${Date.now()}_${fileName}`;

  const { data, error } = await supabase.storage.from('avatars').createSignedUploadUrl(path);
  if (error || !data) return NextResponse.json({ error: error?.message || 'Failed to sign url' }, { status: 500 });

  return NextResponse.json({ uploadUrl: data.signedUrl, path });
}