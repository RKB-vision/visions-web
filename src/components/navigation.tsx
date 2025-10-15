'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
// Remove unused Image import
import UserButton from './auth/user-button';
import { useThemePrefs } from './ui/theme-provider';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Remove unused isAuthModalOpen and setIsAuthModalOpen
  const pathname = usePathname();
  const { data: session } = useSession();
  const { mode, setMode, toggleHighContrast, toggleLargeFont, toggleReaderMode, toggleReduceMotion } = useThemePrefs();
  const [unread, setUnread] = useState<number>(() => Number(localStorage.getItem('notif_unread') ?? '3'));

  const handleSignOut = () => {
    signOut();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore Projects', href: '/explore' },
    { name: 'Explore Creators', href: '/explore-creators' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="bg-black bg-opacity-90 backdrop-blur-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-white font-semibold text-xl">Visions</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      pathname === link.href
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {session?.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      pathname === '/admin'
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {session ? (
                <UserButton />
              ) : (
                <Link href="/auth/signin"
                  className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  Sign In
                </Link>
              )}
              {/* Theme & accessibility quick toggles */}
              <div className="flex items-center gap-2 ml-3">
                <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} className="text-gray-300 hover:text-white text-sm">Theme</button>
                <button onClick={toggleHighContrast} className="text-gray-300 hover:text-white text-sm">HC</button>
                <button onClick={toggleLargeFont} className="text-gray-300 hover:text-white text-sm">A+</button>
                <button onClick={toggleReaderMode} className="text-gray-300 hover:text-white text-sm">Reader</button>
                <button onClick={toggleReduceMotion} className="text-gray-300 hover:text-white text-sm">Reduce</button>
                <Link href="/notifications" className="relative text-gray-300 hover:text-white">
                  {/* Bell */}
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 00-7 7v4.586l-1.707 1.707A1 1 0 004 18h16a1 1 0 00.707-1.707L19 13.586V9a7 7 0 00-7-7zm0 20a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
                  {unread > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">{unread}</span>}
                </Link>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-black bg-opacity-95"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {session ? (
              <>
                <Link 
                  href="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {session.user?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/signin"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 block w-full text-center bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}