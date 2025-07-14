
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NetworkProvider } from "@/contexts/NetworkContext";

// Pages
import Login from "./pages/Login";
import MySurvey from "./pages/MySurvey";
import AddSurvey from "./pages/AddSurvey";
import Profile from "./pages/Profile";
import SurveyForm from "./pages/SurveyForm";
import History from "./pages/History";
import UdiseValidation from "./pages/UdiseValidation";
import SurveyLanguageSelection from "./pages/SurveyLanguageSelection";
import NotFound from "./pages/NotFound";

// Components
import BottomNavigation from "./components/BottomNavigation";
import ProfileButton from "./components/ProfileButton";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userToken');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Layout wrapper for authenticated pages
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <ProfileButton />
      {children}
      <BottomNavigation />
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('userToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout>
                    <MySurvey />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/add-survey" element={
                <ProtectedRoute>
                  <AppLayout>
                    <AddSurvey />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/history" element={
                <ProtectedRoute>
                  <AppLayout>
                    <History />
                  </AppLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/udise-validation/:surveyId" element={
                <ProtectedRoute>
                  <UdiseValidation />
                </ProtectedRoute>
              } />
              
              <Route path="/survey-language/:surveyId" element={
                <ProtectedRoute>
                  <SurveyLanguageSelection />
                </ProtectedRoute>
              } />
              
              <Route path="/survey/:surveyId" element={
                <ProtectedRoute>
                  <SurveyForm />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NetworkProvider>
    </QueryClientProvider>
  );
};

export default App;
