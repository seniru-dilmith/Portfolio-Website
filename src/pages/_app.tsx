import Head from 'next/head';
import '../styles/globals.css';
import { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/components/context/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_NAME}</title>
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
