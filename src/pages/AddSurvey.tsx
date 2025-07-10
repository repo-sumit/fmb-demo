import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SurveyCard, { Survey } from '@/components/SurveyCard';
import { Search, CheckCircle, WifiOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNetwork } from '@/contexts/NetworkContext';

const AddSurvey: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetwork();
  const [searchQuery, setSearchQuery] = useState('');
  const [addedSurveys, setAddedSurveys] = useState<Set<string>>(new Set());

  const handleAddSurvey = (surveyId: string) => {
    if (!isOnline) {
      toast({
        title: "Connect to network to add a survey",
        description: "You need to be online to add new surveys.",
        variant: "destructive"
      });
      return;
    }

    // Simulate adding survey to user's list
    setAddedSurveys(prev => new Set([...prev, surveyId]));
    
    toast({
      title: "Survey Added",
      description: "Survey has been added to your list successfully!",
    });

    // In a real app, you would make an API call here
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  // Function to find survey by ID
  const findSurveyById = (id: string): Survey | undefined => {
    const privateSurveys: Survey[] = [
      {
        id: 'PVT_EDU_001',
        name: 'Private School Quality Assessment',
        description: 'Comprehensive evaluation of teaching standards, infrastructure, and student outcomes in private educational institutions',
        type: 'In School',
        access: 'Private',
        languages: ['English', 'Hindi']
      },
      {
        id: 'PVT_EDU_002',
        name: 'Coaching Center Effectiveness Study',
        description: 'Assessment of supplementary education programs and their impact on student academic performance',
        type: 'Open',
        access: 'Private',
        languages: ['English']
      },
      {
        id: 'PVT_EDU_003',
        name: 'Educational Technology Adoption Survey',
        description: 'Evaluation of digital learning tools, smart classrooms, and technology integration in schools',
        type: 'In School',
        access: 'Private',
        languages: ['Hindi', 'English', 'Gujarati']
      },
      {
        id: 'PVT_EDU_004',
        name: 'Parent Satisfaction and Engagement Study',
        description: 'Assessment of parental involvement in school activities and satisfaction with educational services',
        type: 'Open',
        access: 'Private',
        languages: ['Hindi', 'English']
      },
      {
        id: 'PVT_EDU_005',
        name: 'Teacher Professional Development Impact',
        description: 'Evaluation of teacher training programs and their effectiveness in improving classroom instruction',
        type: 'Open',
        access: 'Private',
        languages: ['English']
      }
    ];

    return privateSurveys.find(survey => survey.id.toLowerCase() === id.toLowerCase());
  };

  const handleSearch = () => {
    if (!isOnline) {
      toast({
        title: "Connect to network to add a survey",
        description: "You need to be online to search and add new surveys.",
        variant: "destructive"
      });
      return;
    }

    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a Survey ID to search.",
        variant: "destructive"
      });
      return;
    }

    const foundSurvey = findSurveyById(searchQuery.trim());
    
    if (foundSurvey) {
      if (addedSurveys.has(foundSurvey.id)) {
        toast({
          title: "Already Added",
          description: "This survey is already in your list.",
        });
      } else {
        handleAddSurvey(foundSurvey.id);
      }
    } else {
      toast({
        title: "Survey Not Found",
        description: "No survey found with the provided ID.",
        variant: "destructive"
      });
    }
  };

  const foundSurvey = searchQuery.trim() ? findSurveyById(searchQuery.trim()) : null;

  if (!isOnline) {
    return (
      <div className="pb-20 pt-4 px-4 min-h-screen bg-background">
        {/* Header */}
        <h1 className="display-l mb-6 text-center">Add Survey</h1>

        {/* Offline Message */}
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff size={32} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">You're Offline</h3>
          <p className="text-muted-foreground text-center">
            Connect to network to add a survey
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 pt-4 px-4 min-h-screen bg-background">
      {/* Header */}
      <h1 className="display-l mb-6 text-center">Add Survey</h1>

      {/* Search Section */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search using ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              disabled={!isOnline}
            />
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground text-center">
          Enter the exact Survey ID to add it to your list
        </p>
      </div>

      {/* Search Result */}
      {foundSurvey && (
        <div className="space-y-4 mb-6">
          <h2 className="font-semibold text-lg">Search Result</h2>
          <div className="relative">
            <SurveyCard
              survey={foundSurvey}
              onAdd={handleAddSurvey}
              showAddButton={!addedSurveys.has(foundSurvey.id)}
            />
            
            {addedSurveys.has(foundSurvey.id) && (
              <div className="absolute inset-0 bg-green-50 bg-opacity-95 rounded-lg flex items-center justify-center">
                <div className="flex items-center gap-2 text-green-700 font-medium">
                  <CheckCircle size={20} />
                  <span>Added Successfully!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">How to Add Surveys</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Search by Survey ID (e.g., PVT_EDU_001)</li>
          <li>• Added surveys will appear in your "My Surveys" list</li>
        </ul>
      </div>
    </div>
  );
};

export default AddSurvey;
