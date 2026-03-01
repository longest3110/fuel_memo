'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EntryForm from '@/components/forms/EntryForm';
import { useAuth } from '@/contexts/AuthContext';

export default function NewEntryPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">認証中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">ログインが必要です。</p>
      </div>
    );
  }

  const handleSuccess = () => {
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 py-8 font-sans dark:bg-black">
      <EntryForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
