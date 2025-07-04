
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NetworkStatus from '@/components/NetworkStatus';
import SurveyCard, { Survey } from '@/components/SurveyCard';
import FilterSheet from '@/components/FilterSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';

const MySurvey: React.FC = () => {
  const navigate = useNavigate();
  const [isOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    types: [] as string[],
    access: [] as string[],
    status: [] as string[]
  });

  // Mock data - in real app this would come from state management
  const surveys: Survey[] = [
    {
      id: 'SCH_2025_001',
      name: 'Annual School Audit',
      description: 'Comprehensive assessment of school infrastructure, teaching quality, and student outcomes',
      type: 'School',
      access: 'Public',
      languages: ['Hindi', 'English'],
      progress: 65
    },
    {
      id: 'HLT_2025_002',
      name: 'Primary Health Center Survey',
      description: 'Evaluation of healthcare facilities and service delivery in rural areas',
      type: 'Health',
      access: 'Private',
      languages: ['Hindi', 'Gujarati'],
    },
    {
      id: 'INF_2025_003',
      name: 'Water & Sanitation Assessment',
      description: 'Infrastructure survey focusing on water supply and sanitation facilities',
      type: 'Infrastructure',
      access: 'Public',
      languages: ['English'],
    }
  ];

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         survey.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filters.types.length === 0 || filters.types.includes(survey.type);
    const matchesAccess = filters.access.length === 0 || filters.access.includes(survey.access);
    
    return matchesSearch && matchesType && matchesAccess;
  });

  const handleStartSurvey = (surveyId: string) => {
    navigate(`/survey/${surveyId}`);
  };

  const handleResumeSurvey = (surveyId: string) => {
    navigate(`/survey/${surveyId}?resume=true`);
  };

  return (
    <div className="pb-20 pt-4 px-4 min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <NetworkStatus isOnline={isOnline} />
        <h1 className="display-l">My Surveys</h1>
        <div className="w-20" /> {/* Spacer for balance */}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search surveys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <FilterSheet filters={filters} onFiltersChange={setFilters}>
          <Button variant="outline" size="icon" className="tap-target">
            <Filter size={16} />
          </Button>
        </FilterSheet>
      </div>

      {/* Active filter chips */}
      {(filters.types.length > 0 || filters.access.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {[...filters.types, ...filters.access].map((filter, index) => (
            <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              {filter}
            </div>
          ))}
        </div>
      )}

      {/* Survey List */}
      <div className="space-y-4">
        {filteredSurveys.length > 0 ? (
          filteredSurveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onStart={handleStartSurvey}
              onResume={handleResumeSurvey}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No surveys found</h3>
            <p className="text-muted-foreground">
              {searchQuery || Object.values(filters).some(arr => arr.length > 0)
                ? "No surveys match your current filters"
                : "You haven't added any surveys yet"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySurvey;
