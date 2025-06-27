import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  businessInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    hours: string[];
    services: string[];
    priceRange: string;
    rating?: number;
    reviewCount?: number;
  };
}

const SEOHead = ({
  title = "LooksNLove - Premium Ladies Salon & Beauty Services | Best Hair, Nail & Spa Treatments",
  description = "LooksNLove is the leading ladies salon offering premium beauty services including hair styling, nail care, facial treatments, bridal packages, and spa services. Book your appointment for professional beauty treatments with expert stylists.",
  keywords = "ladies salon, beauty salon, hair salon, nail salon, spa services, hair styling, hair coloring, facial treatment, manicure, pedicure, bridal makeup, beauty treatments, professional styling, women salon, beauty parlour, hair care, skin care, nail art, wedding makeup, ladies beauty services",
  image = "/placeholder.svg",
  url = "https://looksnlove.com",
  type = "website",
  author = "LooksNLove Beauty Team",
  businessInfo = {
    name: "LooksNLove Ladies Salon",
    address: "123 Beauty Boulevard, Fashion District, New York, NY 10001",
    phone: "+1 (555) 123-LOVE",
    email: "hello@looksnlove.com",
    hours: [
      "Monday-Friday: 9:00 AM - 8:00 PM",
      "Saturday: 8:00 AM - 7:00 PM", 
      "Sunday: 10:00 AM - 6:00 PM"
    ],
    services: ["Hair Styling", "Hair Coloring", "Facial Treatments", "Nail Care", "Bridal Packages", "Spa Services"],
    priceRange: "$25-$300",
    rating: 4.9,
    reviewCount: 487
  }
}: SEOHeadProps) => {
  const siteTitle = title.includes("LooksNLove") ? title : `${title} | LooksNLove`;

  // Generate rich structured data
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": url,
    "name": businessInfo.name,
    "alternateName": "LooksNLove",
    "description": description,
    "url": url,
    "logo": `${url}/placeholder.svg`,
    "image": [
      `${url}/placeholder.svg`,
      `${url}/salon-interior.jpg`,
      `${url}/beauty-services.jpg`
    ],
    "telephone": businessInfo.phone,
    "email": businessInfo.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Beauty Boulevard",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.7589",
      "longitude": "-73.9851"
    },
    "openingHours": [
      "Mo-Fr 09:00-20:00",
      "Sa 08:00-19:00", 
      "Su 10:00-18:00"
    ],
    "priceRange": businessInfo.priceRange,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": businessInfo.rating,
      "reviewCount": businessInfo.reviewCount,
      "bestRating": 5,
      "worstRating": 1
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Beauty Services",
      "itemListElement": businessInfo.services.map((service, index) => ({
        "@type": "Offer",
        "position": index + 1,
        "itemOffered": {
          "@type": "Service",
          "name": service,
          "provider": {
            "@type": "BeautySalon",
            "name": businessInfo.name
          }
        }
      }))
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free WiFi",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification", 
        "name": "Air Conditioning",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Parking Available",
        "value": true
      }
    ],
    "paymentAccepted": "Cash, Credit Card, Debit Card, Digital Payments",
    "currenciesAccepted": "USD",
    "areaServed": {
      "@type": "City",
      "name": "New York"
    },
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "40.7589",
        "longitude": "-73.9851"
      },
      "geoRadius": "25"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": businessInfo.name,
    "url": url,
    "logo": `${url}/placeholder.svg`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": businessInfo.phone,
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://www.facebook.com/looksnlove",
      "https://www.instagram.com/looksnlove", 
      "https://www.twitter.com/looksnlove"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": businessInfo.name,
    "url": url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="geo.region" content="US-NY" />
      <meta name="geo.placename" content="New York" />
      <meta name="geo.position" content="40.7589;-73.9851" />
      <meta name="ICBM" content="40.7589, -73.9851" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="LooksNLove" />
      <meta property="og:locale" content="en_US" />
      <meta property="business:contact_data:street_address" content="123 Beauty Boulevard" />
      <meta property="business:contact_data:locality" content="New York" />
      <meta property="business:contact_data:region" content="NY" />
      <meta property="business:contact_data:postal_code" content="10001" />
      <meta property="business:contact_data:country_name" content="United States" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@looksnlove" />
      <meta name="twitter:site" content="@looksnlove" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#e91e63" />
      <meta name="msapplication-TileColor" content="#e91e63" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=yes" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(businessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default SEOHead;