import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfileButton from '@/components/ProfileButton';
import NetworkToggle from '@/components/NetworkToggle';

const Header: React.FC = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'My Surveys';
      case '/history':
        return 'My Responses';
      case '/add-survey':
        return 'Add Survey';
      default:
        return '';
    }
  };

  // Only show header on main pages
  const showHeader = ['/', '/history', '/add-survey'].includes(location.pathname);

  if (!showHeader) return null;

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <NetworkToggle />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex-1"></div>
        
        <h1 className="text-2xl font-semibold text-center">{getPageTitle()}</h1>
        <div className="flex-1 flex justify-end">
          <ProfileButton />
        </div>
      </div>
    </header>
  );
};

export default Header;