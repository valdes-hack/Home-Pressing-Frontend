'use client';

import React, { useEffect, useState } from 'react';
import { Download, X, Sparkles, Smartphone } from 'lucide-react';

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Enregistrement du Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker actif, scope :', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Erreur enregistrement SW :', err);
        });
    }

    // 2. Détection du prompt d'installation PWA (Android / Chrome / Edge)
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Afficher la bannière si non refusée récemment
      const dismissed = localStorage.getItem('pwa_banner_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 3. Détection iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isIosDevice && !isStandalone) {
      setIsIos(true);
      const dismissedIos = localStorage.getItem('pwa_ios_dismissed');
      if (!dismissedIos) {
        setShowIosGuide(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] Résultat installation :', outcome);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa_banner_dismissed', 'true');
  };

  const handleDismissIos = () => {
    setShowIosGuide(false);
    localStorage.setItem('pwa_ios_dismissed', 'true');
  };

  return (
    <>
      {/* BANNIÈRE D'INSTALLATION PWA (Android / Windows / Mac) */}
      {showInstallBanner && (
        <aside
          role="status"
          aria-label="Proposition d'installation de l'application"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#081a36] text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Installer l'application</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-slate-950">
                  PWA
                </span>
              </h4>
              <p className="text-[11px] text-slate-300 truncate">
                Accès direct et fonctionnement hors-ligne
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Installer</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* GUIDE SPÉCIFIQUE iOS SAFARI */}
      {showIosGuide && (
        <aside
          role="status"
          aria-label="Guide d'installation iPhone et iPad"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#081a36] text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Installer sur iPhone / iPad
            </span>
            <button onClick={handleDismissIos} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Pour installer l'application : appuyez sur le bouton <strong>Partager</strong> (<span className="text-blue-400">⎋</span>) dans Safari puis sélectionnez <strong>« Sur l'écran d'accueil »</strong>.
          </p>
        </aside>
      )}
    </>
  );
}
