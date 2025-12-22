import { Metadata } from 'next';
import './globals.css';
import CookieConsent from "@/components/CookieBanner";

// environment variable for metadataBase
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.myqs.co.ke';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'myQS, Professional Quantity Surveying Services in Kenya',
    template: '%s | myQS',
  },
  description: 'Delivering comprehensive quantity surveying solutions across all sectors of the built environment with precision, integrity, and innovation. Connect with qualified quantity surveyors in Kenya.',
  keywords: [
    'quantity surveying',
    'QS services Kenya',
    'construction cost management',
    'quantity surveyor Nairobi',
    'cost estimation',
    'project management',
    'construction consulting',
    'bill of quantities',
    'tender documentation',
    'contract administration'
  ],
  authors: [{ name: 'myQS', url: baseUrl }],
  creator: 'myQS',
  publisher: 'myQS',
  applicationName: 'myQS',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'myQS, Professional Quantity Surveying Services',
    description: 'Comprehensive quantity surveying solutions with precision, integrity, and innovation.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'myQS, Professional Quantity Surveying Services',
      },
    ],
    url: baseUrl,
    siteName: 'myQS',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'myQS, Professional Quantity Surveying Services',
    description: 'Comprehensive quantity surveying solutions with precision, integrity, and innovation.',
    images: ['/og-image.jpg'],
    creator: '@myQS',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'business',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YWMMDDBYP2"
          suppressHydrationWarning
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                
                gtag('consent', 'default', {
                  'analytics_storage': 'denied',
                  'ad_storage': 'denied',
                  'ad_user_data': 'denied',
                  'ad_personalization': 'denied'
                });
                
                gtag('config', 'G-YWMMDDBYP2', {
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=None;Secure'
                });
              })();
            `,
          }}
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#1a2332" />
        <meta name="color-scheme" content="dark light" />
        
        {/* Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        
        {/* AdSense */}
        <script 
          id="adsense-verification"
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8772969412576999"
          crossOrigin="anonymous"
        />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'myQS',
              alternateName: 'myQS Kenya',
              url: baseUrl,
              logo: `${baseUrl}/logo.png`,
              image: `${baseUrl}/og-image.jpg`,
              description: 'Professional quantity surveying services across all sectors of the built environment with precision, integrity, and innovation.',
              telephone: '+254768930892',
              email: 'info@myqs.africa',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Nairobi',
                addressCountry: 'KE',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: -1.286389,
                longitude: 36.817223,
              },
              areaServed: {
                '@type': 'Country',
                name: 'Kenya',
              },
              priceRange: '$$',
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '08:00',
                  closes: '17:00',
                },
              ],
              sameAs: [
                'https://x.com/myQS',
                'https://linkedin.com/myQS',
                'https://facebook.com/myQS',
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}