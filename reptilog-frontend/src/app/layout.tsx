import "./globals.css";
import Footer from "../components/Footer";
import { GridBackground } from "../components/GridBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen flex flex-col relative">
        <GridBackground />
        <main className="flex-grow mt-24 relative z-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
