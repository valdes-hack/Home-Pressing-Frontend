'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser, clearSession } from '@/lib/api';
import { Shirt, LogOut, LayoutDashboard, ShoppingBag, Factory, Banknote, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  if (pathname === '/login') return null;

  const profil = user?.profil?.toUpperCase() || '';
  const isDg = profil === 'DG';
  const isAgent = profil === 'AGENT';
  const isRecep = profil === 'RÉCEPTIONNISTE' || profil === 'RECEPTIONNISTE';

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500 rounded-lg text-white">
              <Shirt className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block">
                Atlantic Palace Pressing
              </span>
              <span className="text-xs text-sky-400 block">
                {user?.nomAgence || 'Système Centralisé'}
              </span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-1">
            {(isRecep || isDg) && (
              <Link
                href="/comptoir"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition ${
                  pathname === '/comptoir' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Dépôt & Bordereau
              </Link>
            )}

            {(isAgent || isDg) && (
              <Link
                href="/atelier"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition ${
                  pathname === '/atelier' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Factory className="w-4 h-4" />
                Atelier Central
              </Link>
            )}

            {(isRecep || isDg) && (
              <Link
                href="/caisse"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition ${
                  pathname === '/caisse' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Banknote className="w-4 h-4" />
                Retrait & Caisse
              </Link>
            )}

            {isDg && (
              <Link
                href="/dg"
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1.5 transition ${
                  pathname === '/dg' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Pilotage DG
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-100 flex items-center justify-end gap-1">
                <User className="w-3.5 h-3.5 text-sky-400" />
                {user?.nomUtilisateur || 'Utilisateur'}
              </div>
              <div className="text-xs text-sky-400 uppercase font-semibold">
                {user?.profil} {user?.codeAgence ? `· ${user?.codeAgence}` : ''}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Se déconnecter"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
