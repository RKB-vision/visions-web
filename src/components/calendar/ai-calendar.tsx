'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'important' | 'reminder';
  zoomLink?: string;
  isAIGenerated: boolean;
}

export default function AICalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeAndCreateEvents = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const aiGeneratedEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'AI Project Review Meeting',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          type: 'meeting',
          zoomLink: 'https://zoom.us/j/123456789',
          isAIGenerated: true
        },
        {
          id: '2',
          title: 'Important: Deploy to Production',
          date: new Date(Date.now() + 48 * 60 * 60 * 1000),
          type: 'important',
          isAIGenerated: true
        }
      ];
      
      setEvents(prev => [...prev, ...aiGeneratedEvents]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const createZoomMeeting = (eventId: string) => {
    // Simulate Zoom meeting creation
    const zoomLink = `https://zoom.us/j/${Math.random().toString().substr(2, 9)}`;
    
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, zoomLink }
          : event
      )
    );
    
    alert(`Zoom meeting created! Link: ${zoomLink}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Calendar</h2>
        <button
          onClick={analyzeAndCreateEvents}
          disabled={isAnalyzing}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isAnalyzing ? 'Analyzing...' : 'AI Analyze & Schedule'}
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
        {/* Simplified calendar grid - in real app, would generate full calendar */}
        {Array.from({ length: 35 }, (_, i) => (
          <div
            key={i}
            className="aspect-square border border-gray-200 p-1 text-sm cursor-pointer hover:bg-gray-50"
          >
            {i + 1 <= 31 ? i + 1 : ''}
          </div>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`border-l-4 pl-4 py-2 ${
              event.type === 'important' ? 'border-red-500 bg-red-50' :
              event.type === 'meeting' ? 'border-blue-500 bg-blue-50' :
              'border-gray-500 bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{event.title}</h4>
                <p className="text-sm text-gray-600">
                  {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {event.isAIGenerated && (
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mt-1">
                    AI Generated
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {event.zoomLink ? (
                  <a
                    href={event.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                  >
                    Join Zoom
                  </a>
                ) : event.type === 'meeting' && (
                  <button
                    onClick={() => createZoomMeeting(event.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                  >
                    Create Zoom
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}