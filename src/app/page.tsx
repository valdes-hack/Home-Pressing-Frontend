'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/api';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace('/login');
    } else if (user.profil === 'DG') {
      router.replace('/dg');
    } else if (user.profil === 'Agent') {
      router.replace('/atelier');
    } else {
      router.replace('/comptoir');
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
      <div className="text-center animate-pulse">
        <div className="text-xl font-semibold">Atlantic Palace Pressing</div>
        <p className="text-sm text-sky-400 mt-2">Chargement du système...</p>
      </div>
    </div>
  );
}
