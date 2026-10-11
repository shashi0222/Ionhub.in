'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Calendar, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Car, 
  Shirt, 
  MapPin, 
  Clock,
  Bike
} from 'lucide-react';
import { UserProfile } from '@/types/database';

interface NavbarProps {
  user?: UserProfile | null;
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Car Wash', href: '/services/car-wash' },
    { name: 'Ironing', href: '/services/ironing' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Banner Notice for Kompally Area */}
      <div className="bg-[#0B4F47] text-[#EAF5E8] text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#3E8E4A]" /> Serving Kompally, Hyderabad
        </span>
        <span className="hidden sm:inline opacity-40">•</span>
        <span className="hidden sm:flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-[#3E8E4A]" /> Daily 6:00 PM – 11:00 PM (Weekends Available)
        </span>
        <span className="hidden md:inline opacity-40">•</span>
        <span className="hidden md:inline text-amber-200">
          🌿 Eco-Friendly Doorstep Care
        </span>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-[#E0EBDD]'
            : 'bg-[#FAF9F2]/90 backdrop-blur-sm py-4 border-b border-[#E0EBDD]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Official Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-full overflow-hidden shadow-sm border border-[#3E8E4A]/30 flex-shrink-0 bg-[#0B4F47]">
                <Image
                  src="/brand/logo_source.png"
                  alt="ION HUB Official Logo"
                  width={44}
                  height={44}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#0B4F47] leading-none">
                  ION <span className="text-[#3E8E4A]">HUB</span>
                </span>
                <span className="text-[10px] tracking-wider text-[#5A7065] font-semibold uppercase mt-0.5">
                  Doorstep Care
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-[#EAF5E8] text-[#0B4F47] font-semibold'
                      : 'text-[#12312C]/80 hover:text-[#0B4F47] hover:bg-[#EAF5E8]/60'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold hover:bg-amber-200 transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Admin
                    </Link>
                  )}
                  {user.role === 'worker' ? (
                    <Link
                      href="/worker"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3E8E4A] hover:bg-[#34783f] text-white text-xs font-black shadow-md transition"
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>Specialist Portal</span>
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF5E8] text-[#0B4F47] text-xs font-semibold hover:bg-[#d9ecd6] transition"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{user.full_name?.split(' ')[0] || 'Dashboard'}</span>
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-semibold text-[#0B4F47] px-3 py-1.5 rounded-full hover:bg-[#EAF5E8] transition"
                >
                  Login
                </Link>
              )}

              {/* Only show Book A Service for customers / guests - never for workers */}
              {user?.role !== 'worker' && (
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B4F47] hover:bg-[#176B5D] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#3E8E4A]" />
                  <span>BOOK A SERVICE</span>
                </Link>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              {user?.role === 'worker' ? (
                <Link
                  href="/worker"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#3E8E4A] text-white text-xs font-bold"
                >
                  <span>Orders</span>
                </Link>
              ) : (
                <Link
                  href="/book"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0B4F47] text-white text-xs font-bold"
                >
                  <span>Book</span>
                </Link>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-[#0B4F47] hover:bg-[#EAF5E8] focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-white border-b border-[#E0EBDD] px-4 pt-3 pb-6 mt-3 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/services/car-wash"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF9F2] border border-[#E0EBDD] text-xs font-semibold text-[#0B4F47]"
              >
                <Car className="w-4 h-4 text-[#3E8E4A]" /> Doorstep Car Wash
              </Link>
              <Link
                href="/services/ironing"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF9F2] border border-[#E0EBDD] text-xs font-semibold text-[#0B4F47]"
              >
                <Shirt className="w-4 h-4 text-[#3E8E4A]" /> Pro Ironing
              </Link>
            </div>

            <div className="border-t border-[#E0EBDD] pt-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.href)
                      ? 'bg-[#EAF5E8] text-[#0B4F47] font-bold'
                      : 'text-[#12312C] hover:bg-[#FAF9F2]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-[#E0EBDD] pt-3 flex flex-col gap-2">
              {user?.role === 'worker' ? (
                <Link
                  href="/worker"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#3E8E4A] text-white text-sm font-black"
                >
                  Specialist Order Queue
                </Link>
              ) : user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-[#EAF5E8] text-[#0B4F47] text-sm font-bold"
                  >
                    My Customer Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-sm font-bold"
                    >
                      Admin Portal
                    </Link>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 rounded-xl border border-[#0B4F47] text-[#0B4F47] text-sm font-bold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 rounded-xl bg-[#0B4F47] text-white text-sm font-bold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
