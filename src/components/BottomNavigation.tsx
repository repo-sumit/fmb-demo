
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'My Survey', icon: Home, path: '/' },
    { id: 'add', label: 'Add Survey', icon: Plus, path: '/add-survey' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="flex">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                flex-1 flex flex-col items-center justify-center py-2 px-1 tap-target
                transition-colors duration-200
                ${isActive 
                  ? 'text-primary bg-primary/5' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
