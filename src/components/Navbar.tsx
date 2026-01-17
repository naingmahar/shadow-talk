"use client";

import React, { useState } from 'react';
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
  Menu,
  X,
  CreditCard,
  Map,      // Icon for Learning Path
  Sparkles  // Icon for Onboarding
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const toggleMenu = () => setIsOpen(!isOpen);

  if (loading) return <div className="h-16 border-b border-slate-100 bg-white" />;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Zap className="text-white" size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">ShadowTalk</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {user && (
              <>
                <NavLink href="/" active={isActive('/')} icon={<LayoutDashboard size={18} />}>Dashboard</NavLink>
                
                {/* New Routes */}
                <NavLink href="/learning-path" active={isActive('/learning-path')} icon={<Map size={18} />}>Learning Path</NavLink>
                <NavLink href="/onboarding" active={isActive('/onboarding')} icon={<Sparkles size={18} />}>Onboarding</NavLink>
                
                <NavLink href="/topics" active={isActive('/topics')} icon={<BookOpen size={18} />}>Topics</NavLink>
                <NavLink href="/practice/shadow" active={isActive('/practice/shadow')} icon={<Mic2 size={18} />}>Shadowing</NavLink>
                <NavLink href="/practice/flashcards" active={isActive('/practice/flashcards')} icon={<CreditCard size={18} />}>Flashcards</NavLink>
                <NavLink href="/history" active={isActive('/history')} icon={<History size={18} />}>History</NavLink>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <button onClick={logout} className="hidden md:flex items-center gap-2 text-red-500 font-bold text-sm px-4 py-2 hover:bg-red-50 rounded-xl transition-all">
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <Link href="/auth" className="hidden md:flex bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-100">
                Sign In
              </Link>
            )}

            <button onClick={toggleMenu} className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-100 shadow-xl overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="px-4 py-6 space-y-2">
            {user ? (
              <>
                <MobileNavLink href="/" onClick={toggleMenu} active={isActive('/')} icon={<LayoutDashboard size={20} />}>Dashboard</MobileNavLink>
                
                {/* Mobile New Routes */}
                <MobileNavLink href="/learning-path" onClick={toggleMenu} active={isActive('/learning-path')} icon={<Map size={20} />}>Learning Path</MobileNavLink>
                <MobileNavLink href="/onboarding" onClick={toggleMenu} active={isActive('/onboarding')} icon={<Sparkles size={20} />}>Onboarding</MobileNavLink>
                
                <MobileNavLink href="/topics" onClick={toggleMenu} active={isActive('/topics')} icon={<BookOpen size={20} />}>Topics</MobileNavLink>
                <MobileNavLink href="/practice/shadow" onClick={toggleMenu} active={isActive('/practice/shadow')} icon={<Mic2 size={20} />}>Shadowing</MobileNavLink>
                <MobileNavLink href="/practice/flashcards" onClick={toggleMenu} active={isActive('/practice/flashcards')} icon={<CreditCard size={20} />}>Flashcards</MobileNavLink>
                <MobileNavLink href="/history" onClick={toggleMenu} active={isActive('/history')} icon={<History size={20} />}>History</MobileNavLink>
                
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button onClick={logout} className="flex items-center gap-3 w-full p-4 text-red-500 font-bold rounded-2xl hover:bg-red-50">
                    <LogOut size={20} /> Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link href="/auth" onClick={toggleMenu} className="flex items-center justify-center gap-2 w-full p-4 bg-blue-600 text-white font-bold rounded-2xl">
                <LogIn size={20} /> Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

/** Helper Components **/
function NavLink({ href, active, icon, children }: { href: string; active: boolean; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
        active 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      {icon} <span className="whitespace-nowrap">{children}</span>
    </Link>
  );
}

function MobileNavLink({ href, active, icon, children, onClick }: { href: string; active: boolean; icon: React.ReactNode; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon} {children}
    </Link>
  );
}