
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!userId.trim()) {
      toast({
        title: "User ID Required",
        description: "Please enter your User ID to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (userId === 'ANT_123' || userId === 'demo') {
        // Successful login
        localStorage.setItem('userToken', 'demo-token');
        localStorage.setItem('userId', userId);
        toast({
          title: "Login Successful",
          description: "Welcome back, Anita Sharma!",
        });
        navigate('/');
      } else {
        // Failed login
        toast({
          title: "Login Failed",
          description: "User ID not found. Please check and try again.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <User size={24} className="text-primary" />
          </div>
          <div>
            <CardTitle className="display-l">Welcome to Sarvekshan</CardTitle>
            <CardDescription className="mt-2">
              Enter your User ID to access your surveys
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g., ANT_123"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <Button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center">
            <p className="caption text-muted-foreground">
              Demo ID: <span className="font-medium">ANT_123</span> or <span className="font-medium">demo</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
