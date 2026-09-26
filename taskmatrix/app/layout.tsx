import { ToastProvider } from '@/components/ToastProvider';
import { Rajdhani } from 'next/font/google';
import './globals.css';

const font = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.variable}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}