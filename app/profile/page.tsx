'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AvatarUploader from '@/src/components/profile/avatar-uploader';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [avatarPath, setAvatarPath] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!session?.user?.email) return;
      const res = await fetch('/api/surveys', { method: 'GET' }); // dummy call to keep example minimal
      // In a real app, add a dedicated API to fetch profile info.
    }
    load();
  }, [session]);

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        {session ? (
          <>
            <div className="flex items-center gap-4">
              {avatarPath ? (
                <Image src={`/api/storage/avatars/${encodeURIComponent(avatarPath)}`} alt="avatar" width={80} height={80} className="w-20 h-20 rounded-full object-cover" />              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200" />
              )}
              <div>
                <p className="text-gray-800 font-medium">{session.user?.name}</p>
                <p className="text-gray-600 text-sm">{session.user?.email}</p>
              </div>
            </div>
            <AvatarUploader onUploaded={setAvatarPath} />
          </>
        ) : (
          <p>Please sign in to manage your profile.</p>
        )}
      </div>
    </div>
  );
}