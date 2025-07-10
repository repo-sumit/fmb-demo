import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NetworkToggle from '@/components/NetworkToggle';
import SurveyCard, { Survey } from '@/components/SurveyCard';
import FilterSheet from '@/components/FilterSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNetwork } from '@/contexts/NetworkContext';

const MySurvey: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline, downloadedSurveys, addDownloadedSurvey } = useNetwork();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    types: [] as string[],
    access: [] as string[],
    status: [] as string[]
  });

  // Enhanced education-focused mock data with 10+ school surveys
  const surveys: Survey[] = [
    {
      id: 'SCH_2025_001',
      name: 'Annual School Infrastructure Audit',
      description: 'Comprehensive assessment of school buildings, classrooms, toilets, drinking water, and playground facilities',
      type: 'In School',
      access: 'Public',
      languages: ['Hindi', 'English'],
      progress: 65
    },
    {
      id: 'EDU_2025_002',
      name: 'Teacher Training Program Evaluation',
      description: 'Assessment of ongoing teacher professional development initiatives and their impact on classroom teaching',
      type: 'Open',
      access: 'Public',
      languages: ['Hindi', 'Gujarati'],
    },
    {
      id: 'SCH_2025_003',
      name: 'Mid-Day Meal Quality Assessment',
      description: 'Evaluation of nutritional quality, hygiene standards, and student satisfaction with school meal programs',
      type: 'In School',
      access: 'Public',
      languages: ['English'],
    },
    {
      id: 'SCH_2025_004',
      name: 'Digital Learning Infrastructure Survey',
      description: 'Assessment of computer labs, internet connectivity, smart classrooms, and digital learning resources',
      type: 'In School',
      access: 'Public',
      languages: ['Hindi', 'English'],
    },
    {
      id: 'SCH_2025_005',
      name: 'School Safety and Security Audit',
      description: 'Comprehensive evaluation of emergency protocols, fire safety measures, boundary walls, and security arrangements',
      type: 'In School',
      access: 'Public',
      languages: ['Hindi', 'English'],
      progress: 30
    },
    {
      id: 'SCH_2025_006',
      name: 'Library and Learning Resources Assessment',
      description: 'Evaluation of library facilities, textbook availability, reference materials, and reading programs',
      type: 'In School',
      access: 'Public',
      languages: ['English', 'Gujarati'],
    },
    {
      id: 'EDU_2025_007',
      name: 'Student Performance Analytics',
      description: 'Analysis of academic achievements, extracurricular participation, and overall student development metrics',
      type: 'Open',
      access: 'Public',
      languages: ['Hindi', 'English'],
      progress: 80
    },
    {
      id: 'SCH_2025_008',
      name: 'Inclusive Education Implementation',
      description: 'Assessment of special needs support, accessibility features, and inclusive teaching practices',
      type: 'In School',
      access: 'Public',
      languages: ['Hindi', 'English', 'Gujarati'],
    },
    {
      id: 'SCH_2025_009',
      name: 'Parent-Teacher Engagement Survey',
      description: 'Evaluation of parent involvement, PTA effectiveness, and home-school communication channels',
      type: 'In School',
      access: 'Public',
      languages: ['Hindi', 'Gujarati'],
    },
    {
      id: 'SCH_2025_010',
      name: 'Environmental Sustainability Audit',
      description: 'Assessment of green initiatives, waste management, energy conservation, and environmental awareness programs',
      type: 'In School',
      access: 'Public',
      languages: ['English'],
    },
    {
      id: 'EDU_2025_011',
      name: 'Community Education Outreach',
      description: 'Evaluation of adult literacy programs, community skill development, and public awareness campaigns',
      type: 'Open',
      access: 'Public',
      languages: ['Hindi', 'Gujarati'],
    },
    {
      id: 'SCH_2025_012',
      name: 'Health and Wellness Program Review',
      description: 'Assessment of health checkups, vaccination drives, mental health support, and wellness initiatives',
      type: 'In School',
      access: 'Public',
      languages: ['Hindi', 'English'],
      progress: 45
    }
  ];

  // Filter surveys based on online/offline status
  const availableSurveys = isOnline 
    ? surveys 
    : surveys.filter(survey => downloadedSurveys.has(survey.id));

  const filteredSurveys = availableSurveys.filter(survey => {
    const matchesSearch = survey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         survey.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filters.types.length === 0 || filters.types.includes(survey.type);
    const matchesAccess = filters.access.length === 0 || filters.access.includes(survey.access);
    
    return matchesSearch && matchesType && matchesAccess;
  });

  const handleStartSurvey = (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (survey?.type === 'In School') {
      // Redirect to UDISE validation
      navigate(`/udise-validation/${surveyId}`);
    } else {
      navigate(`/survey/${surveyId}`);
    }
  };

  const handleResumeSurvey = (surveyId: string) => {
    navigate(`/survey/${surveyId}?resume=true`);
  };

  const handleDownloadSurvey = (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) return;

    // Simulate download with progress
    toast({
      title: "Download Started",
      description: `Preparing ${survey.name} for offline use...`,
    });

    // Simulate download completion after 2 seconds
    setTimeout(() => {
      addDownloadedSurvey(surveyId);
      toast({
        title: "Download Complete",
        description: `${survey.name} is ready for offline use`,
      });
    }, 2000);
  };

  return (
    <div className="pb-20 pt-4 px-4 min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          {!isOnline && (
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
              You are offline
            </div>
          )}
        </div>
        <h1 className="display-l">My Surveys</h1>
        <div className="flex-1 flex justify-end">
          <NetworkToggle />
        </div>
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
              onDownload={handleDownloadSurvey}
              isDownloaded={downloadedSurveys.has(survey.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No surveys found</h3>
            <p className="text-muted-foreground">
              {!isOnline && filteredSurveys.length === 0
                ? "No downloaded surveys available offline"
                : searchQuery || Object.values(filters).some(arr => arr.length > 0)
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
