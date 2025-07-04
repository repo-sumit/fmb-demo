
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SurveyCard, { Survey } from '@/components/SurveyCard';
import { Search, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AddSurvey: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [addedSurveys, setAddedSurveys] = useState<string[]>([]);

  // Mock available surveys - in real app this would come from API
  const availableSurveys: Survey[] = [
    {
      id: 'EDU_2025_004',
      name: 'Teacher Training Assessment',
      description: 'Evaluation of teacher training programs and their effectiveness',
      type: 'School',
      access: 'Public',
      languages: ['Hindi', 'English', 'Tamil']
    },
    {
      id: 'HLT_2025_005',
      name: 'Vaccination Coverage Survey',
      description: 'Assessment of immunization coverage in rural communities',
      type: 'Health',
      access: 'Public',
      languages: ['Hindi', 'Bengali']
    },
    {
      id: 'INF_2025_006',
      name: 'Digital Infrastructure Audit',
      description: 'Survey of internet connectivity and digital infrastructure',
      type: 'Infrastructure',
      access: 'Private',
      languages: ['English']
    }
  ];

  const filteredSurveys = availableSurveys.filter(survey =>
    survey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    survey.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSurvey = (surveyId: string) => {
    setAddedSurveys(prev => [...prev, surveyId]);
    toast({
      title: "Survey Added",
      description: "Survey has been added to your list successfully!",
    });
    
    // Simulate API call delay
    setTimeout(() => {
      console.log(`Survey ${surveyId} added to user's surveys`);
    }, 1000);
  };

  return (
    <div className="pb-20 pt-4 px-4 min-h-screen bg-background">
      {/* Header */}
      <div className="mb-6">
        <h1 className="display-l mb-2">Add Survey</h1>
        <p className="body text-muted-foreground">
          Search and add surveys to your collection
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="Enter Survey ID or search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        {searchQuery ? (
          filteredSurveys.length > 0 ? (
            filteredSurveys.map((survey) => (
              <div key={survey.id} className="relative">
                <SurveyCard
                  survey={survey}
                  showAddButton={!addedSurveys.includes(survey.id)}
                  onAdd={handleAddSurvey}
                />
                {addedSurveys.includes(survey.id) && (
                  <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center">
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Plus size={14} />
                      </div>
                      Added Successfully
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No surveys found</h3>
              <p className="text-muted-foreground">
                Try searching with a different survey ID or name
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Find New Surveys</h3>
            <p className="text-muted-foreground">
              Start typing to search for available surveys
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSurvey;
