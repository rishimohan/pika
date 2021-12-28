import Head from 'next/head'
import Main from "components/main";

export default function Home() {
  return (
    <>
      <Head>
        <title>Pika – Create beautiful screenshots quickly</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main />
    </>
  );
}
