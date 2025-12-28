"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Mic2, 
  LogOut, 
  LogIn,
  Zap,
  BookOpen,
  History,
  Loader2
} from 'lucide-react';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // 1. Prevents "Sign In" button flicker while Firebase checks the user
  if (loading) {
    return (
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 h-16 flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-200" size={20} />
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Zap className="text-white" size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              ShadowTalk
            </span>
          </Link>

          {/* Navigation Links - ADDED TOPIC AND HISTORY HERE */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <NavLink href="/" active={isActive('/')} icon={<LayoutDashboard size={18} />}>
                  Dashboard
                </NavLink>
                <NavLink href="/topics" active={isActive('/topics')} icon={<BookOpen size={18} />}>
                  Topics
                </NavLink>
                <NavLink href="/practice" active={isActive('/practice')} icon={<Mic2 size={18} />}>
                  Practice
                </NavLink>
                <NavLink href="/history" active={isActive('/history')} icon={<History size={18} />}>
                  History
                </NavLink>
              </>
            ) : (
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4">
                Tech English Shadowing
              </p>
            )}
          </div>

          {/* Action Button Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-900 leading-none">
                    {user.displayName || 'Developer'}
                  </p>
                </div>
                
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-red-100"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100"
              >
                <LogIn size={16} />
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, active, icon, children }: { href: string, active: boolean, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        active 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}