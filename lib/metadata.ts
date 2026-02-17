// lib/metadata.ts
import type { Metadata } from 'next';

export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      name: 'Antonio Roger',
      alternateName: ['Antonio Rogers Prince','Antonio Roger'],
      url: 'https://antonioroger2.github.io/cv/',
      image: 'https://antonioroger2.github.io/cv/data/avatar.jpg',
      jobTitle: 'AI/ML Engineer & Full Stack Developer',
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Amrita Vishwa Vidyapeetham',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Coimbatore',
        addressCountry: 'India',
      },
      sameAs: [
        'https://in.linkedin.com/in/antonio-roger-a2a9b71b3',
        'https://github.com/antonioroger2',
      ],
    },
    {
      '@type': 'WebSite',
      name: 'Antonio Roger Portfolio',
      url: 'https://antonioroger2.github.io/cv/',
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL('https://antonioroger2.github.io/cv/'),
  title: 'Antonio Roger | AI Student & Full Stack Developer',
  description: 'Antonio Roger - Artificial Intelligence undergraduate at Amrita Vishwa Vidyapeetham, Coimbatore, India. Professional portfolio showcasing AI/ML projects, web development, and innovative solutions | Student Amrita University Coimbatore.',
  keywords: ['Antonio Roger','Antonio Roger Coimbatore','Antonio Roger Amrita University','Antonio Roger Amrita','Roger Amrita University','Antonio Amrita Coimbatore','Antonio AI', 'Roger Developer','AI Undergraduate Amrita Vishwa Vidyapeetham','Amrita University Coimbatore','Antonio Roger Developer Portfolio'], 
  authors: [{ name: 'Antonio Roger' }],
  creator: 'Antonio Roger',
  publisher: 'Antonio Roger',
  alternates: {
    canonical: 'https://antonioroger2.github.io/cv',
  },
  openGraph: {
    title: 'Antonio Roger | AI Student & Full Stack Developer',
    description: 'Antonio Roger - Artificial Intelligence undergraduate at Amrita Vishwa Vidyapeetham, Coimbatore, India. Professional portfolio showcasing AI/ML projects, web development, and innovative solutions | Student Amrita University Coimbatore.',
    url: 'https://antonioroger2.github.io/cv/',
    siteName: 'Antonio Roger Portfolio',
    images: [
      {
        url: 'https://antonioroger2.github.io/cv/data/avatar.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};
