import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ title, description, keywords, name, type }) => {
    // Schema.org structured data for SoftwareApplication
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "BudgetWise",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "description": description,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    };

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title} | BudgetWise</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />

            {/* End standard metadata tags */}

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {/* End Facebook tags */}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content={type} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {/* End Twitter tags */}
        </Helmet>
    );
}

SEO.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string
};

SEO.defaultProps = {
    title: 'BudgetWise',
    description: 'AI-Driven Personal Finance Assistant',
    keywords: 'personal finance, expense tracker, budget planner, finance app, money management',
    name: 'BudgetWise Team',
    type: 'website'
};

export default SEO;
