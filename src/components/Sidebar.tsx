'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import { clearSession } from '@/lib/api';
import {
  LayoutDashboard,
  Building2,
  ShoppingBag,
  Factory,
  BarChart3,
  Users,
  Tag,
  Settings,
  Bell,
  CreditCard,
  PackageCheck,
  User,
  History,
  FileText,
  AlertTriangle,
  LogOut,
  X,
  Star
} from 'lucide-react';

interface SidebarProps {
  user: any;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ user, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeItemHref, setActiveItemHref] = useState<string | null>(null);

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const profil = (user?.profil || '').toUpperCase();
  const isDg = profil === 'DG';
  const isAgent = profil === 'AGENT';
  const isClient = profil === 'CLIENT';

  let navItems: { label: string; href: string; icon: any; badge?: string }[] = [];

  if (isDg) {
    navItems = [
      { label: 'Tableau de bord', href: '/dg?view=dashboard', icon: LayoutDashboard },
      { label: 'Agences Réseau', href: '/dg?view=agences', icon: Building2 },
      { label: 'Commandes Réseau', href: '/comptoir?view=commandes', icon: ShoppingBag },
      { label: 'Atelier Central', href: '/atelier', icon: Factory },
      { label: 'Utilisateurs & Sécurité', href: '/dg?view=utilisateurs', icon: Users },
      { label: 'Paramètres du Site', href: '/dg?view=parametres', icon: Settings },
      { label: 'Centre Alertes', href: '/comptoir?view=notifications', icon: Bell, badge: 'SMS/WA' },
      { label: 'Mon Profil', href: '/comptoir?view=profil', icon: User },
    ];
  } else if (isAgent) {
    navItems = [
      { label: 'Tableau de bord', href: '/atelier', icon: LayoutDashboard },
      { label: 'Commandes à traiter', href: '/atelier#traiter', icon: ShoppingBag },
      { label: 'Suivi Production', href: '/atelier#production', icon: Factory },
      { label: 'Historique', href: '/atelier#historique', icon: History },
      { label: 'Notifications', href: '/atelier#notifications', icon: Bell },
    ];
  } else if (isClient) {
    navItems = [
      { label: 'Tableau de bord', href: '/espace-client?view=dashboard', icon: LayoutDashboard },
      { label: 'Suivi Commandes', href: '/espace-client?view=commandes', icon: ShoppingBag },
      { label: 'Mes Factures', href: '/espace-client?view=factures', icon: FileText },
      { label: 'Points Fidélité (RG27)', href: '/espace-client?view=fidelite', icon: Star },
      { label: 'Mon Profil & Paramètres', href: '/espace-client?view=profil', icon: User },
    ];
  } else {
    // Réceptionniste
    navItems = [
      { label: 'Tableau de bord', href: '/comptoir?view=dashboard', icon: LayoutDashboard },
      { label: 'Clients & Fidélité', href: '/comptoir?view=clients', icon: Users },
      { label: 'Commandes', href: '/comptoir?view=commandes', icon: ShoppingBag },
      { label: 'Caisse & Règlements', href: '/caisse', icon: CreditCard },
      { label: 'Retraits (RG6/16)', href: '/comptoir?view=retraits', icon: PackageCheck },
      { label: 'Notifications Client', href: '/comptoir?view=notifications', icon: Bell, badge: '2' },
      { label: 'Profil & Droits', href: '/comptoir?view=profil', icon: User },
    ];
  }

  const displayName = user?.nomUtilisateur || (
    isDg ? 'Directeur Général' :
    isAgent ? 'Agent Atelier' :
    isClient ? 'Client Pressing' : 'Réceptionniste'
  );

  const displayRole = (
    isDg ? 'Direction Générale' :
    isAgent ? 'Agent Atelier' :
    isClient ? 'Compte Client' : 'Réceptionniste'
  );

  // Synchronisation rapide de l'état actif
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const full = `${pathname}${window.location.search}`;
      setActiveItemHref(full);
    }
  }, [pathname]);

  const handleNavClick = (href: string) => {
    setActiveItemHref(href);
    if (onClose) onClose();

    // Si on est déjà sur la même page mais avec un paramètre ?view=..., on notifie immédiatement
    const currentBase = pathname;
    const targetBase = href.split('?')[0];

    if (currentBase === targetBase && href.includes('?view=')) {
      const viewParam = href.split('?view=')[1];
      const url = new URL(window.location.href);
      url.searchParams.set('view', viewParam);
      window.history.pushState({}, '', url.toString());
      window.dispatchEvent(new Event('popstate'));
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#081a36] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800/60 shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Haut : Logo Brand & Bouton fermer sur mobile */}
      <div>
        <div className="pt-5 pb-4 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex-1 flex justify-center lg:justify-start">
            <Logo theme="dark" size="md" />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links avec scrollbar personnalisée chic et réaction immédiate */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] sidebar-scroll">
          {navItems.map((item) => {
            const Icon = item.icon;
            const currentSearch = typeof window !== 'undefined' ? window.location.search : '';
            const currentPathWithSearch = `${pathname}${currentSearch}`;

            const isActive = activeItemHref === item.href
              || currentPathWithSearch === item.href
              || (item.href.includes('view=dashboard') && (pathname === item.href.split('?')[0] && (!currentSearch || currentSearch === '?view=dashboard')))
              || (pathname === item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-100 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold scale-[1.01]'
                    : 'text-slate-300 hover:bg-[#11294d] hover:text-white active:scale-95'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bas : Carte Utilisateur avec ANNEAU ARC-EN-CIEL & Déconnexion */}
      <div className="p-3 border-t border-slate-800/80 bg-[#061429]/80 backdrop-blur-xs">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#0d2242] border border-slate-800/70">
          <div className="flex items-center space-x-2.5 min-w-0">
            {/* AVATAR AVEC ANNEAU ARC-EN-CIEL CONNECTÉ */}
            <div className="rainbow-avatar-ring">
              <div className="w-8 h-8 rounded-full bg-slate-950 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                {displayName.charAt(0)}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] text-slate-400 truncate">{displayRole}</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] text-emerald-400 font-semibold">En ligne</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Se déconnecter"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
