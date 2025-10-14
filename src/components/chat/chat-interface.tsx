'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  senderName: string;
}

export default function ChatInterface() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      senderName: session?.user?.name || 'You'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 500);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />;
      case 'sent':
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
      case 'delivered':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'read':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h3 className="font-semibold">AI Chat</h3>
        <p className="text-sm opacity-90">Real-time messaging</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-900'
              }`}>
                <p className="text-sm">{message.text}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.sender === 'user' && (
                    <div className="ml-2">
                      {getStatusIcon(message.status)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}