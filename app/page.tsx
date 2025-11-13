import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="mb-8 text-5xl font-bold text-black dark:text-white sm:text-6xl">
          Inventory management
        </h1>

        <Link href="/sign-in" className="mb-16">
          <button className="rounded-full bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700">
            sign in
          </button>
        </Link>
      </main>
    </div>
  );
}
