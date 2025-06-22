import { AppProps } from 'next/app';
import Head from 'next/head';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import '../styles/globals.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>NX Fullstack Framework - Admin</title>
        <meta name="description" content="Admin dashboard for NX Fullstack Framework" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="light">
          <main className="app">
            <Component {...pageProps} />
          </main>
        </NextThemesProvider>
      </NextUIProvider>
    </>
  );
}

export default CustomApp;