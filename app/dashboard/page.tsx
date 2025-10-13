'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import WelcomeSequence from '@/components/welcome-sequence';
import ChatInterface from '@/components/chat/chat-interface';
import AICalendar from '@/components/calendar/ai-calendar';

export default function Dashboard() {
  const { data: session } = useSession();
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    const welcomed = localStorage.getItem('hasSeenWelcome');
    if (welcomed) {
      setShowWelcome(false);
      setHasSeenWelcome(true);
    }
  }, []);

  const handleWelcomeComplete = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
    setHasSeenWelcome(true);
  };

  if (showWelcome && !hasSeenWelcome) {
    return <WelcomeSequence onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to your Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your AI projects, chat, and calendar all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chat Interface */}
        <div className="h-96">
          <ChatInterface />
        </div>

        {/* AI Calendar */}
        <div>
          <AICalendar />
        </div>
      </div>
    </div>
  );
}