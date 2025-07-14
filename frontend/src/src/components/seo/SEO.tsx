import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
}

const SEO = ({
  title = "Salon Beauty - Premium Beauty & Wellness Services",
  description = "Transform your beauty with our premium salon services. Professional hair styling, facial treatments, nail care, and wellness services. Book your appointment today!",
  keywords = "salon, beauty, hair styling, facial treatment, nail care, spa, wellness, beauty services, professional styling, manicure, pedicure",
  image = "/placeholder.svg",
  url = "https://looksnlove.com",
  type = "website",
  author = "Salon Beauty Team"
}: SEOProps) => {
  const siteTitle = title.includes("Salon Beauty") ? title : `${title} | Salon Beauty`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Salon Beauty" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#9333ea" />
      <meta name="msapplication-TileColor" content="#9333ea" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BeautySalon",
          "name": "Salon Beauty",
          "description": description,
          "url": url,
          "logo": `${url}/placeholder.svg`,
          "image": image,
          "telephone": "+1 (555) 123-4567",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Beauty Street",
            "addressLocality": "City",
            "addressCountry": "US"
          },
          "openingHours": [
            "Mo-Fr 09:00-19:00",
            "Sa 09:00-17:00",
            "Su 10:00-16:00"
          ],
          "priceRange": "$25-$200",
          "servesCuisine": [],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Beauty Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Hair Styling"
                }
              },
              {
                "@type": "Offer", 
                "itemOffered": {
                  "@type": "Service",
                  "name": "Facial Treatment"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service", 
                  "name": "Nail Care"
                }
              }
            ]
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;