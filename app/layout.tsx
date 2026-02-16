import type { Metadata, Viewport } from 'next';
import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider';
import { ThemeProvider } from 'next-themes';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  weight: ['700', '900'],
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {

  metadataBase: new URL('https://antonioroger2.github.io/cv'), 
  title: 'Portfolio | AI/ML Engineer & Full Stack Developer',
  description: 'Professional portfolio showcasing AI/ML projects, web development, and innovative solutions | Student Amrita University Coimbatore',
  keywords: ['AI', 'Machine Learning', 'Full Stack Developer', 'React', 'Node.js', 'Python', 'Portfolio', 'Amrita University', 'Coimbatore', 'Projects', 'Professional Experience','Amrita Vishwa Vidyapeetham','Student','Department of AI'],
  authors: [{ name: 'Antonio Roger' }],
  creator: 'Antonio Roger',
  publisher: 'Antonio Roger',
  openGraph: {
    title: 'Antonio Roger | AI/ML Engineer & Full Stack Developer',
    description: 'Professional portfolio showcasing AI/ML projects, web development, and innovative solutions',
    url: 'https://antonioroger2.github.io/cv', // 2. Updated URL
    siteName: 'Antonio Roger Portfolio',
    images: [
      {
        url: '/data/avatar.jpg',
        width: 1200,
        height: 630,
        alt: 'Antonio Roger - AI/ML Engineer & Full Stack Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | AI/ML Engineer & Full Stack Developer',
    description: 'Professional portfolio showcasing AI/ML projects, web development, and innovative solutions',
    images: ['/data/avatar.jpg'],
    creator: '@antonioroger2', 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google043fe67c63ee76c0.html', 
  },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1e293b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
