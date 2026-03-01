'use client';

import { Entry } from '@/types/entries';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface EntryCardProps {
  entry: Entry;
  onDelete?: (entryId: string) => void;
}

function calculateFuelEconomy(entry: Entry): number {
  if (entry.fuelAmount <= 0) return 0;
  return entry.distanceSinceLastRefuel / entry.fuelAmount;
}

function calculatePricePerLiter(entry: Entry): number {
  if (entry.fuelAmount <= 0) return 0;
  return entry.price / entry.fuelAmount;
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export default function EntryCard({ entry, onDelete }: EntryCardProps) {
  const fuelEconomy = calculateFuelEconomy(entry);
  const pricePerLiter = calculatePricePerLiter(entry);

  const dateOptions = {
    addSuffix: true,
    locale: ja,
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium">
            {formatDate(entry.createdAt)}
          </span>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(entry.id)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            title="削除"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">給油量</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {entry.fuelAmount.toFixed(2)}{' '}
            <span className="text-sm font-normal text-zinc-500">L</span>
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">金額</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {entry.price.toLocaleString()}{' '}
            <span className="text-sm font-normal text-zinc-500">円</span>
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">走行距離</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {entry.distanceSinceLastRefuel.toFixed(1)}{' '}
            <span className="text-sm font-normal text-zinc-500">km</span>
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">燃費</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {fuelEconomy.toFixed(2)} <span className="text-sm font-normal text-zinc-500">km/L</span>
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">1Lあたり</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {pricePerLiter.toFixed(1)} <span className="text-sm font-normal text-zinc-500">円</span>
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-3">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">経過日数</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {entry.createdAt instanceof Date && !isNaN(entry.createdAt.getTime())
              ? formatDistanceToNow(entry.createdAt, dateOptions)
              : '不明'}
          </p>
        </div>
      </div>
    </div>
  );
}
