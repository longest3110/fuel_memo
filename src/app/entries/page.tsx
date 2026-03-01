'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EntryCard from '@/components/cards/EntryCard';
import { useAuth } from '@/contexts/AuthContext';
import { getEntriesByUser, deleteEntry } from '@/lib/firestore';
import { Entry } from '@/types/entries';

export default function EntriesPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user?.uid) {
      fetchEntries(user.uid);
    }
  }, [user]);

  const fetchEntries = async (userId: string) => {
    setIsLoadingEntries(true);
    setError(null);
    try {
      const entriesData = await getEntriesByUser(userId, 100);
      setEntries(entriesData);
    } catch (err) {
      setError('データの読み込みに失敗しました。');
      console.error(err);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!window.confirm('この記録を削除してもよろしいですか？')) {
      return;
    }

    try {
      await deleteEntry(entryId);
      setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    } catch (err) {
      setError('削除に失敗しました。');
      console.error(err);
    }
  };

  if (isLoading || isLoadingEntries) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">読み込み中...</p>
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 py-8 font-sans dark:bg-black">
      <div className="w-full max-w-4xl px-6">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">給油記録一覧</h1>
          <button
            onClick={() => router.push('/entries/new')}
            className="bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] px-4 py-2 rounded-md text-sm font-semibold transition-colors"
          >
            新規追加
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
            {error}
          </div>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-800 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2.5 13.5c-.67 0-1.32.17-1.89.48a3.5 3.5 0 0 0-1.62 4.38l.79 1.58a3.5 3.5 0 0 0 4.96 1.2l6.35-2.54a2.5 2.5 0 0 1 3.26 0l6.35 2.54a3.5 3.5 0 0 0 4.96-1.2l.79-1.58a3.5 3.5 0 0 0-1.62-4.38c-.57-.31-1.22-.48-1.89-.48H2.5z" />
              <path d="M10 2v6" />
              <path d="M17 2v6" />
            </svg>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">給油記録がありません</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              新規追加ボタンから最初の記録を追加しましょう
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          表示件数: {entries.length} 件
        </p>
      </div>
    </div>
  );
}
