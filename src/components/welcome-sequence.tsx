'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface WelcomeSequenceProps {
  onComplete: () => void;
}

export default function WelcomeSequence({ onComplete }: WelcomeSequenceProps) {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState('');
  const [showUsernameInput, setShowUsernameInput] = useState(false);

  const welcomeSteps = [
    "Welcome to Visions",
    "Your AI-Powered Platform",
    "Let's Get Started"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < welcomeSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        if (session) {
          setShowUsernameInput(true);
        } else {
          setTimeout(onComplete, 1000);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep, session, onComplete]);

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      localStorage.setItem('userDisplayName', username);
      onComplete();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-900 flex items-center justify-center z-50"
      >
        <div className="text-center">
          {!showUsernameInput ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {welcomeSteps[currentStep]}
              </h1>
              <div className="flex justify-center space-x-2 mt-8">
                {welcomeSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index <= currentStep ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome back, {session?.user?.name}!
              </h2>
              <p className="text-gray-600 mb-6">
                How would you like to be addressed?
              </p>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your preferred name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
              />
              <button
                onClick={handleUsernameSubmit}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}