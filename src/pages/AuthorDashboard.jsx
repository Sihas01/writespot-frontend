import React, { useEffect, useState } from 'react';
import HomePage from './AuthorHomePage';
import Header from '../components/AuthorDashboard/Header';
import Navigation from '../components/AuthorDashboard/Navigation';


const AuthorDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
   const [showHeader, setShowHeader] = useState(true);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolling down or up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setShowHeader(false);
        setIsNavSticky(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        if (currentScrollY < 50) {
          // Near top, show header and make nav non-sticky
          setShowHeader(true);
          setIsNavSticky(false);
        } else {
          // Still scrolled down but going up, keep nav sticky
          setShowHeader(false);
          setIsNavSticky(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
    //   case 'publications':
    //     return <MyPublicationsPage />;
    //   case 'revenue':
    //     return <RevenuePage />;
      default:
        return <HomePage />;
    }
  };

  return (
   <div className="min-h-screen bg-gray-50">
      <Header username="John" isVisible={showHeader} />
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isSticky={isNavSticky}
      />
      
      <main className={`px-4 lg:px-32 mx-auto py-6 ${isNavSticky ? 'mt-16' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default AuthorDashboard;