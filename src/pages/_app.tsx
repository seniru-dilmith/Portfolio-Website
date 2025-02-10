import Head from "next/head";
import "../styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect } from "react";
import { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const canonicalUrl = `https://seniru.dev${router.asPath.split("?")[0]}`;

  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Seniru Dilmith",
      jobTitle: "Full Stack Developer",
      url: "https://seniru.dev",
      sameAs: [
        "https://linkedin.com/in/seniru-dilmith",
        "https://github.com/seniru-dilmith",
        "https://twitter.com/seniru_dilmith",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Moraspirit",
      },
      studiesAt: {
        "@type": "University",
        name: "University of Moratuwa",
      },
    };

    const scriptTag = document.createElement("script");
    scriptTag.type = "application/ld+json";
    scriptTag.textContent = JSON.stringify(schemaData);
    document.head.appendChild(scriptTag);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Head>
          <title>{process.env.NEXT_PUBLIC_SITE_NAME || "My App"}</title>
          <link rel="canonical" href={canonicalUrl} />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
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
    </ThemeProvider>
  );
}

export default MyApp;
