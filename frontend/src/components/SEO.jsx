/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({
    title = 'Aerofisc',
    description = 'Aerofisc - AI-Driven Financial Autopilot. Track expenses, manage budgets, and automate your wealth with next-gen insights.',
    keywords = 'best expense tracker, free budget app, ai finance assistant, personal finance 2024, money manager, track spending, savings goals, recurring bill reminder, financial freedom, zero based budgeting, expense manager app',
    name = 'Aerofisc',
    type = 'website',
    image = null
}) => {
    const siteUrl = 'https://budgetwise-tracker-ai-driven.vercel.app';
    const defaultImage = `${siteUrl}/logo.png`;
    const socialImage = image ? `${siteUrl}${image}` : defaultImage;

    // Schema.org structured data for SoftwareApplication + Rich Snippets
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Aerofisc",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web, iOS, Android",
        "description": description,
        "image": defaultImage,
        "url": siteUrl,
        "author": {
            "@type": "Organization",
            "name": "Aerofisc Team"
        },
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1250",
            "bestRating": "5",
            "worstRating": "1"
        },
        "featureList": [
            "AI Expense Categorization",
            "Recurring Bill Tracking",
            "Visual Budget Analytics",
            "Export to PDF/Excel"
        ]
    };

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title} | Aerofisc</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
            <link rel="canonical" href={siteUrl} />

            {/* End standard metadata tags */}

            {/* Structured Data (JSON-LD) for Rich Results */}
            <script type="application/ld+json">
                {JSON.stringify({
                    ...structuredData,
                    name: "Aerofisc",
                    author: { "@type": "Organization", "name": "Aerofisc Team" },
                })}
            </script>

            {/* Facebook Open Graph tags */}
            <meta property="og:url" content={siteUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={socialImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Aerofisc" />

            {/* Twitter tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={socialImage} />
            <meta name="twitter:image:alt" content="Aerofisc App Dashboard" />
        </Helmet>
    );
}

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    image: PropTypes.string
};

export default SEO;
