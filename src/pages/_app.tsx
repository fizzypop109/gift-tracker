// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <>
        <Head>
          <title>Gift Tracker</title>
          <meta name="description" content="Keep every gift idea organised" />
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        </Head>
        <Component {...pageProps} />
      </>
  );
}