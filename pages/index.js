import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js + TailwindCSS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Remove from here */}
        <div className="relative flex items-center justify-center h-screen overflow-hidden dark:bg-[#222]">
          <h1 className="text-3xl font-black md:text-5xl dark:text-white">
            Next.js Tailwind Starter
          </h1>
        </div>
        {/* To here */}
      </main>
    </>
  );
}
