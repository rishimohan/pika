import Head from "next/head";
import "styles/app.scss";
import { Toaster } from "react-hot-toast";
import Script from "next/script"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Pika – Create beautiful screenshots quickly</title>
        <meta
          name="title"
          content="Pika – Create screenshots and browser mockups quickly"
        />
        <meta
          name="description"
          content="Quickly generate browser mockups and screenshots with Pika, a free and open-source app. You can add gradient backgrounds, add browser frame,rounded corners and more."
        />
        <link rel="canonical" href="https://pika.rishimohan.me" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pika.rishimohan.me" />
        <meta
          property="og:title"
          content="Pika – Create screenshots and browser mockups quickly"
        />
        <meta
          property="og:description"
          content="Quickly generate browser mockups and screenshots with Pika, a free and open-source app. You can add gradient backgrounds, add browser frame,rounded corners and more."
        />
        <meta
          property="og:image"
          content="https://pika.rishimohan.me/meta-image.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://pika.rishimohan.me" />
        <meta
          property="twitter:title"
          content="Pika – Create screenshots and browser mockups quickly"
        />
        <meta
          property="twitter:description"
          content="Quickly generate browser mockups and screenshots with Pika, a free and open-source app. You can add gradient backgrounds, add browser frame,rounded corners and more."
        />
        <meta
          property="twitter:image"
          content="https://pika.rishimohan.me/meta-image.png"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={true}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="shortcut icon"
          href="/icons/favicon.ico"
          type="image/x-icon"
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/icons/apple-touch-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/icons/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/icons/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/icons/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/icons/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/icons/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/apple-touch-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon-180x180.png"
        />
      </Head>
      {process.env.NODE_ENV == "production" ? (
        <>
          {/* This is analytics code for tracking pageviews and events
          make sure to remove this if you fork this project */}
          <Script
            type="text/javascript"
            src="https://api.pirsch.io/pirsch-events.js"
            id="pirscheventsjs"
            data-code="kaScBB3dGIMhydL8olxpevpomMoFywp1"
            strategy="afterInteractive"
          />
          <Script
            src="https://api.pirsch.io/pirsch.js"
            id="pirschjs"
            data-code="kaScBB3dGIMhydL8olxpevpomMoFywp1"
            strategy="afterInteractive"
          />
        </>
      ) : (
        ""
      )}
      <Component {...pageProps} />
      <Toaster position="bottom-center" />
    </>
  );
}

export default MyApp;
