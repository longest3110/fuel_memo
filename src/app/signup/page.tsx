'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length (Firebase default is 6 characters)
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password);
      router.push('/');
    } catch (err) {
      setError('Failed to sign up. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-md px-8 py-16">
        <h1 className="mb-8 text-3xl font-semibold text-black dark:text-zinc-50">Sign up</h1>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-50"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-base text-black outline-1 placeholder:text-zinc-400 focus:outline-2 dark:text-white sm:leading-6"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-50"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-base text-black outline-1 placeholder:text-zinc-400 focus:outline-2 dark:text-white sm:leading-6"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-50"
            >
              Confirm password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-base text-black outline-1 placeholder:text-zinc-400 focus:outline-2 dark:text-white sm:leading-6"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-colors hover:bg-[#383838] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            {isLoading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-foreground hover:text-zinc-800 dark:hover:text-zinc-200">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
