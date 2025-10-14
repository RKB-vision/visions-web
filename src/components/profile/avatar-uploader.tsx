'use client';

import { useState } from 'react';

export default function AvatarUploader({ onUploaded }: { onUploaded: (path: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    setError(null);
    if (!file) return;
    const sign = await fetch('/api/avatar/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, contentType: file.type || 'application/octet-stream' })
    });
    const json = await sign.json();
    if (!sign.ok) { setError(json.error ?? 'Failed to get upload URL'); return; }

    const res = await fetch(json.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
    if (!res.ok) { setError('Upload failed'); return; }

    setProgress(100);
    await fetch('/api/avatar/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: json.path }) });
    onUploaded(json.path);
  }

  return (
    <div className="space-y-3">
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={upload} className="bg-black text-white px-3 py-2 rounded" disabled={!file}>Upload Avatar</button>
      {progress > 0 && <div className="text-sm text-gray-600">Upload progress: {progress}%</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}