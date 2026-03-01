'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import EntryCard from '@/components/cards/EntryCard';
import { getEntriesByUser, deleteEntry } from '@/lib/firestore';
import { Entry } from '@/types/entries';
import FuelAmountChart from '@/components/charts/FuelAmountChart';
import PriceChart from '@/components/charts/PriceChart';
import DistanceChart from '@/components/charts/DistanceChart';
import PricePerLiterChart from '@/components/charts/PricePerLiterChart';
import FuelEconomyChart from '@/components/charts/FuelEconomyChart';

interface EntryWithId extends Entry {
  id: string;
}

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<EntryWithId[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch entries when user is available
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
      // Add id to entries for EntryCard compatibility
      setEntries(entriesData.map((e) => ({ ...e, id: e.id })));
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

  // Calculate summary statistics
  const calculateSummary = () => {
    if (entries.length === 0) {
      return {
        totalEntries: 0,
        totalFuelAmount: 0,
        totalCost: 0,
        averageFuelEconomy: 0,
      };
    }

    const totalFuelAmount = entries.reduce((sum, entry) => sum + entry.fuelAmount, 0);
    const totalCost = entries.reduce((sum, entry) => sum + entry.price, 0);
    const totalDistance = entries.reduce((sum, entry) => sum + entry.distanceSinceLastRefuel, 0);
    const averageFuelEconomy = totalDistance / totalFuelAmount;

    return {
      totalEntries: entries.length,
      totalFuelAmount: parseFloat(totalFuelAmount.toFixed(2)),
      totalCost: Math.round(totalCost),
      averageFuelEconomy: parseFloat(averageFuelEconomy.toFixed(2)),
    };
  };

  const summary = calculateSummary();

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
      <div className="w-full px-6 md:px-12 lg:px-8">
        <div className="mb-8">
          <Link
            href="/entries/new"
            className="block w-full bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] px-4 py-4 rounded-md text-sm font-semibold transition-colors text-center"
          >
            新規追加
          </Link>
        </div>

        {/* Summary Statistics */}
        {entries.length > 0 && (
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">記録数</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {summary.totalEntries} <span className="text-sm font-normal text-zinc-500">件</span>
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">合計給油量</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {summary.totalFuelAmount}{' '}
                <span className="text-sm font-normal text-zinc-500">L</span>
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">合計金額</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {summary.totalCost.toLocaleString()}{' '}
                <span className="text-sm font-normal text-zinc-500">円</span>
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">平均燃費</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {summary.averageFuelEconomy}{' '}
                <span className="text-sm font-normal text-zinc-500">km/L</span>
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
            {error}
          </div>
        )}

        {/* Charts Section */}
        <div className="mb-8 space-y-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">グラフ</h2>

          <FuelAmountChart entries={entries} />
          <PriceChart entries={entries} />
          <DistanceChart entries={entries} />
          <PricePerLiterChart entries={entries} />
          <FuelEconomyChart entries={entries} />
        </div>

        {/* Recent Entries Section */}
        {entries.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              最新の記録
            </h2>
            <div className="grid gap-4">
              {entries.slice(0, 5).map((entry) => (
                <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
              ))}
            </div>
            {entries.length > 5 && (
              <Link
                href="/entries"
                className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              >
                すべて見る ({entries.length} 件)
              </Link>
            )}
          </div>
        )}

        {entries.length === 0 && (
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
        )}
      </div>
    </div>
  );
}
