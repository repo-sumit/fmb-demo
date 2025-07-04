
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SurveyCard, { Survey } from '@/components/SurveyCard';
import { Search, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AddSurvey: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [addedSurveys, setAddedSurveys] = useState<Set<string>>(new Set());

  // Private education-related surveys for demonstration
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

  const filteredSurveys = privateSurveys.filter(survey =>
    survey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    survey.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    survey.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSurvey = (surveyId: string) => {
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

  const handleSearch = () => {
    // Search functionality is handled by the filter above
    // This could trigger additional API calls in a real app
  };

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
              placeholder="Enter Survey ID or search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} variant="outline">
            Search
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground text-center">
          Search for education-related surveys by ID, name, or description
        </p>
      </div>

      {/* Available Surveys */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg mb-4">Available Private Surveys</h2>
        
        {filteredSurveys.length > 0 ? (
          filteredSurveys.map((survey) => (
            <div key={survey.id} className="relative">
              <SurveyCard
                survey={survey}
                onAdd={handleAddSurvey}
                showAddButton={!addedSurveys.has(survey.id)}
              />
              
              {addedSurveys.has(survey.id) && (
                <div className="absolute inset-0 bg-green-50 bg-opacity-95 rounded-lg flex items-center justify-center">
                  <div className="flex items-center gap-2 text-green-700 font-medium">
                    <CheckCircle size={20} />
                    <span>Added Successfully!</span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : searchQuery ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No surveys found</h3>
            <p className="text-muted-foreground">
              No education surveys match "{searchQuery}". Try a different search term.
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Use the search bar above to find specific surveys by ID or browse available options.
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">How to Add Surveys</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Search by Survey ID (e.g., PVT_EDU_001)</li>
          <li>• Browse by survey name or description</li>
          <li>• All surveys are education-focused</li>
          <li>• Added surveys will appear in your "My Surveys" list</li>
        </ul>
      </div>
    </div>
  );
};

export default AddSurvey;
