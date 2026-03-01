'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEntry } from '@/lib/firestore';
import { EntryData } from '@/types/entries';
import { useAuth } from '@/contexts/AuthContext';

interface EntryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EntryForm({ onSuccess, onCancel }: EntryFormProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [fuelAmount, setFuelAmount] = useState('');
  const [price, setPrice] = useState('');
  const [distanceSinceLastRefuel, setDistanceSinceLastRefuel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    setError(null);

    const fuelAmountNum = parseFloat(fuelAmount);
    const priceNum = parseFloat(price);
    const distanceNum = parseFloat(distanceSinceLastRefuel);

    // Validate fuel amount
    if (isNaN(fuelAmountNum) || fuelAmountNum <= 0) {
      setError('給油量は0より大きい値を入力してください');
      return false;
    }

    // Validate price
    if (isNaN(priceNum) || priceNum < 0) {
      setError('金額は0以上の値を入力してください');
      return false;
    }

    // Validate distance
    if (isNaN(distanceNum) || distanceNum < 0) {
      setError('走行距離は0以上の値を入力してください');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      setError('ユーザーが認証されていません。');
      return;
    }

    const entryData: EntryData = {
      userId: user.uid,
      fuelAmount: parseFloat(fuelAmount),
      price: parseFloat(price),
      distanceSinceLastRefuel: parseFloat(distanceSinceLastRefuel),
    };

    setIsLoading(true);

    try {
      await createEntry(entryData);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('データの保存に失敗しました。もう一度お試しください。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-8 py-16">
      <h1 className="mb-8 text-3xl font-semibold text-black dark:text-zinc-50">
        給油データ入力
      </h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Fuel Amount */}
        <div className="mb-4">
          <label
            htmlFor="fuelAmount"
            className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-50"
          >
            給油量 (L)
          </label>
          <div className="mt-2">
            <input
              id="fuelAmount"
              name="fuelAmount"
              type="number"
              step="0.01"
              min="0"
              required
              value={fuelAmount}
              onChange={(e) => setFuelAmount(e.target.value)}
              className="block w-full rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-base text-black outline-1 placeholder:text-zinc-400 focus:outline-2 dark:text-white sm:leading-6"
              placeholder="例: 30.5"
            />
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-50"
          >
            金額 (円)
          </label>
          <div className="mt-2">
            <input
              id="price"
              name="price"
              type="number"
              step="1"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-base text-black outline-1 placeholder:text-zinc-400 focus:outline-2 dark:text-white sm:leading-6"
              placeholder="例: 5000"
            />
          </div>
        </div>

        {/* Distance Since Last Refuel */}
        <div className="mb-6">
          <label
            htmlFor="distanceSinceLastRefuel"
            className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-50"
          >
            前回給油時からの走行距離 (km)
          </label>
          <div className="mt-2">
            <input
              id="distanceSinceLastRefuel"
              name="distanceSinceLastRefuel"
              type="number"
              step="0.1"
              min="0"
              required
              value={distanceSinceLastRefuel}
              onChange={(e) => setDistanceSinceLastRefuel(e.target.value)}
              className="block w-full rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-base text-black outline-1 placeholder:text-zinc-400 focus:outline-2 dark:text-white sm:leading-6"
              placeholder="例: 350"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex flex-1 justify-center rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-colors hover:bg-[#383838] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            {isLoading ? '保存中...' : '保存'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex justify-center rounded-md bg-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              キャンセル
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
