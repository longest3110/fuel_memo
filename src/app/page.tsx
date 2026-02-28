'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated (useEffect to avoid setState during render)
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">ようこそ、Fuel Memo！</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            ログイン中: {user?.email} さん
          </p>
        </div>
      </main>
    </div>
  );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">認証中...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">ようこそ、Fuel Memo！</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            ログイン中: {user?.email} さん
          </p>
        </div>
      </main>
    </div>
  );
}
