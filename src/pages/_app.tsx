import Head from 'next/head';
import '../styles/globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { AppProps } from 'next/app';
import { AuthProvider } from '@/components/context/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_NAME || 'My App'}</title>
      </Head>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        {/* Main Content */}
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        {/* Footer */}
      </div>
    </AuthProvider>
  );
}

export default MyApp;
