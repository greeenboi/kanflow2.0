import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme/theme-provider';
import UserProvider from '@/context/UserContext';

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
  title: 'Kanban Task Tracker',
  description: 'A modern task tracking application with Kanban boards',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full font-geist`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={[
            'light',
            'dark',
            'system',
            'redlight',
            'reddark',
            'greenlight',
            'greendark',
            'purplelight',
            'purpledark',
            'yellowlight',
            'yellowdark',
            'teallight',
            'tealdark',
          ]}
        >
          <UserProvider>
            {children}
            <Toaster richColors position='top-right' />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
