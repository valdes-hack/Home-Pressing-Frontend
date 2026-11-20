'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, fetchApi } from '@/lib/api';
import {
  Menu,
  Search,
  Bell,
  Maximize2,
  Minimize2,
  Building2,
  ChevronDown,
  LogOut,
  User,
  ExternalLink,
  MessageSquare,
  Mail,
  CheckCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  Users
} from 'lucide-react';

interface TopHeaderProps {
  user: any;
  onToggleSidebar?: () => void;
  onSearch?: (query: string) => void;
}

export default function TopHeader({ user, onToggleSidebar, onSearch }: TopHeaderProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<{
    commandes: any[];
    clients: any[];
  }>({ commandes: [], clients: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Charger les notifications réelles
  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await fetchApi('/notifications');
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (err) {
        // Fallback avec notifications par défaut si la table est vide
        setNotifications([
          {
            idNotification: 1,
            numFacture: 'YA1-26-000001',
            nomClient: 'Jean-Baptiste Atangana',
            telClient: '+237694112233',
            statutSms: 'Envoyé',
            messageWhatsApp: 'Bonjour Jean-Baptiste Atangana, vos 2 articles sont prêts au retrait à l\'Agence Bastos.',
            messageEmail: 'Votre linge est prêt et soigneusement emballé au comptoir de Bastos.',
            waLink: 'https://wa.me/237694112233?text=Bonjour%20Jean-Baptiste%20Atangana,%20votre%20commande%20YA1-26-000001%20est%20prête.',
            mailtoLink: 'mailto:jean.baptiste@gmail.com?subject=Commande%20Prête%20Atlantic%20Palace'
          }
        ]);
      }
    }
    loadNotifications();
    const interval = setInterval(loadNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  // Recherche instantanée multi-ressources
  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setSearchResults({ commandes: [], clients: [] });
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [cmds, cls] = await Promise.allSettled([
          fetchApi('/commandes'),
          fetchApi('/clients')
        ]);

        const term = searchTerm.toLowerCase();
        let foundCmds: any[] = [];
        let foundClients: any[] = [];

        if (cmds.status === 'fulfilled' && Array.isArray(cmds.value)) {
          foundCmds = cmds.value.filter((c: any) =>
            (c.numFacture || '').toLowerCase().includes(term) ||
            (c.client?.nomClient || '').toLowerCase().includes(term) ||
            (c.statutCmd || '').toLowerCase().includes(term)
          ).slice(0, 5);
        }

        if (cls.status === 'fulfilled' && Array.isArray(cls.value)) {
          foundClients = cls.value.filter((cl: any) =>
            (cl.nomClient || '').toLowerCase().includes(term) ||
            (cl.telClient || '').includes(term)
          ).slice(0, 5);
        }

        setSearchResults({ commandes: foundCmds, clients: foundClients });
        setShowSearchDropdown(true);
      } catch (err) {
        // En cas d'erreur
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fermer les dropdowns en cliquant en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  const profil = (user?.profil || '').toUpperCase();
  const isDg = profil === 'DG';
  const displayName = user?.nomUtilisateur || (isDg ? 'Directeur Général' : 'Réceptionniste');
  const agencyName = user?.nomAgence || (isDg ? 'Siège Central — DG' : 'Agence Bastos');

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Côté Gauche : Hamburger & Barre de recherche instantanée */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-xl" ref={searchRef}>
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (searchTerm.length >= 2) setShowSearchDropdown(true);
              }}
              placeholder="Recherche instantanée : commande, client, téléphone..."
              className="w-full pl-10 pr-9 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-800 rounded-full border border-slate-200/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* MENU DÉROULANT DES RÉSULTATS INSTANTANÉS */}
          {showSearchDropdown && (searchResults.commandes.length > 0 || searchResults.clients.length > 0) && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 max-h-96 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Commandes trouvées */}
              {searchResults.commandes.length > 0 && (
                <div className="p-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                    Commandes ({searchResults.commandes.length})
                  </div>
                  {searchResults.commandes.map((cmd) => (
                    <button
                      key={cmd.numFacture}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        router.push(`/comptoir?view=commandes&search=${encodeURIComponent(cmd.numFacture)}`);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl transition flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono text-xs font-bold text-blue-600">{cmd.numFacture}</div>
                        <div className="text-xs text-slate-700 font-medium">{cmd.client?.nomClient}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          cmd.statutCmd === 'Prêt' ? 'bg-emerald-100 text-emerald-800' :
                          cmd.statutCmd === 'Retiré' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {cmd.statutCmd}
                        </span>
                        <div className="text-xs font-semibold text-slate-900 mt-0.5">{cmd.montantTotal} FCFA</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Clients trouvés */}
              {searchResults.clients.length > 0 && (
                <div className="p-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    Clients ({searchResults.clients.length})
                  </div>
                  {searchResults.clients.map((cl) => (
                    <button
                      key={cl.idClient}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        router.push(`/comptoir?view=clients&search=${encodeURIComponent(cl.nomClient)}`);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl transition flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">{cl.nomClient}</div>
                        <div className="text-[11px] text-slate-500">{cl.telClient}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-medium">
                        {cl.pointsFidelite || 0} pts
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Côté Droit : Badge Agence, Notifications, Plein écran & Profil */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Badge Agence */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-500">Agence :</span>
          <span className="font-semibold text-slate-900">{agencyName}</span>
        </div>

        {/* Bouton Notifications interactif avec menu déroulant */}
        <div className="relative" ref={notifRef}>
          <button
            title="Centre de notifications"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* MENU DÉROULANT DES NOTIFICATIONS */}
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Notifications & Alertes</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
                  {notifications.length} actives
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    Aucune notification en attente.
                  </div>
                ) : (
                  notifications.map((n, idx) => (
                    <div key={n.idNotification || idx} className="p-3 hover:bg-slate-50 transition space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-900">{n.nomClient}</span>
                          <span className="text-[10px] font-mono text-blue-600 ml-2">[{n.numFacture}]</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                          {n.statutSms || 'Prêt'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{n.messageWhatsApp || n.messageEmail}</p>

                      {/* Boutons d'action directs WhatsApp et Email */}
                      <div className="flex items-center gap-2 pt-1">
                        {n.waLink && (
                          <a
                            href={n.waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold transition"
                          >
                            <MessageSquare className="w-3 h-3" />
                            WhatsApp
                          </a>
                        )}
                        {n.mailtoLink && (
                          <a
                            href={n.mailtoLink}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-semibold transition"
                          >
                            <Mail className="w-3 h-3" />
                            Email
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    router.push('/comptoir?view=notifications');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Ouvrir le centre de messagerie complet →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bouton Plein Écran */}
        <button
          title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
          onClick={toggleFullscreen}
          className="hidden sm:flex p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Profil Utilisateur avec CERCLE ARC-EN-CIEL vibrant */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2.5 p-1 sm:px-2.5 sm:py-1 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition"
          >
            {/* AVATAR AVEC ANNEAU ARC-EN-CIEL CONNECTÉ */}
            <div className="rainbow-avatar-ring">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                {displayName.charAt(0)}
              </div>
            </div>

            <div className="hidden sm:block text-left text-xs">
              <span className="font-semibold text-slate-800 block truncate max-w-[130px]">
                {displayName}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium block">
                ● En ligne
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Menu déroulant profil */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-blue-600 font-medium">{profil}</p>
                <p className="text-[10px] text-slate-400 truncate">{agencyName}</p>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push(isDg ? '/dg?view=parametres' : '/comptoir?view=profil');
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Mon profil & paramètres</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2 transition border-t border-slate-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Se déconnecter</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
