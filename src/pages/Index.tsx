
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('userToken');
    if (token) {
      // User is authenticated, redirect to main app
      navigate('/', { replace: true });
    } else {
      // User not authenticated, redirect to login
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading Sarvekshan...</p>
      </div>
    </div>
  );
};

export default Index;
