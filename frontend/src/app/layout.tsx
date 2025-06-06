import './globals.css';
import Navbar from '@/components/Navbar'
import type { Metadata } from 'next'
import localFont from 'next/font/local'


const hkGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/HKGrotesk-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HKGrotesk-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HKGrotesk-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HKGrotesk-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/HKGrotesk-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-hkgrotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Exibeat',
  description: 'Exibeat-Task',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={hkGrotesk.variable}>
       <body>
        <main>
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  )
}
