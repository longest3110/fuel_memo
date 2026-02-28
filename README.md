# fuel_memo

A Next.js application built with TypeScript, ESLint, and Prettier.

## Setup

```bash
npm install
```

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase/Google Cloud Identity Platform credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=your_project_id
NEXT_PUBLIC_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_MESSAGE_SENDER_ID=your_sender_id
NEXT_PUBLIC_APP_ID=your_app_id
```

To get these values:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings > General
4. Scroll down to "Your apps" and select Web App
5. Copy the `firebaseConfig` values

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

- **Login**: `/login`
- **Signup**: `/signup`

## Building

```bash
npm run build
```

## Linting & Formatting

```bash
# Run ESLint
npm run lint

# Run ESLint with auto-fix
npm run lint:fix

# Format with Prettier
npm run format

# Check formatting with Prettier
npm run format:check
```
