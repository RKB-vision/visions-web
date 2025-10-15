'use client';

import { useEffect, useState } from 'react';

type Notification = { id: string; text: string; read: boolean; createdAt: string };

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(() => [
    { id: '1', text: 'Someone mentioned you', read: false, createdAt: new Date().toISOString() },
    { id: '2', text: 'Project saved', read: false, createdAt: new Date().toISOString() },
    { id: '3', text: 'System: digest enabled', read: true, createdAt: new Date().toISOString() },
  ]);

  useEffect(() => {
    const unread = items.filter(i => !i.read).length;
    localStorage.setItem('notif_unread', String(unread));
  }, [items]);

  function toggleRead(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, read: !i.read } : i));
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="space-y-2">
        {items.map(n => (
          <div key={n.id} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className={`font-medium ${n.read ? 'text-gray-500' : 'text-gray-900'}`}>{n.text}</p>
              <p className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => toggleRead(n.id)} className="text-sm px-3 py-1 rounded bg-black text-white hover:bg-gray-800">
              Mark {n.read ? 'unread' : 'read'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}