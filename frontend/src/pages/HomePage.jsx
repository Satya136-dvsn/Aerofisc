import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeatureShowcase from '../components/landing/FeatureShowcase';
import HowItWorks from '../components/landing/HowItWorks';
import TechStack from '../components/landing/TechStack';
import OpenSourceCTA from '../components/landing/OpenSourceCTA';
import Footer from '../components/landing/Footer';

const HomePage = () => {
  const location = useLocation();

  // Scroll to section if hash present
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <Box sx={{ bgcolor: '#030712', minHeight: '100vh' }}>
      <SEO
        title="Aerofisc - Personal Finance Command Center"
        description="Free, open-source personal finance app with AI predictions, voice commands, receipt scanning, and smart budgeting."
      />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features */}
      <FeatureShowcase />

      {/* How It Works */}
      <HowItWorks />

      {/* Tech Stack */}
      <TechStack />

      {/* Open Source CTA */}
      <OpenSourceCTA />

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default HomePage;