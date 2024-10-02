import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AppWalletProvider } from '@/components/AppWalletProvider';
import NavBar from '@/components/Navbar';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Ziamatix',
  description: 'Building the next generation On-Chain Game Experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWalletProvider>
          <NavBar />
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
