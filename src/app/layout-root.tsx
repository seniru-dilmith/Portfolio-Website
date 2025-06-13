import { ReactNode } from "react";
import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const canonicalUrl = `https://seniru.dev${
    process.env.NEXT_PUBLIC_PATHNAME || ""
  }`;

  return (
    <html lang="en" data-arp="">
      <head>
        <title>{process.env.NEXT_PUBLIC_SITE_NAME || "My App"}</title>
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
