import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';

export const metadata: Metadata = {
  title: 'CodeAdapt AI — Every student gets the right problem at the right time',
  description: 'Intelligent, adaptive DSA practice in Python that continuously tracks your mastery and selects the optimal next problem.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-500/20 antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
