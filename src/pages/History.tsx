import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyCard, { Survey } from '@/components/SurveyCard';
import FilterSheet from '@/components/FilterSheet';
import ViewResponse from '@/components/ViewResponse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Filter, Search, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [filters, setFilters] = useState({
    types: [] as string[],
    access: [] as string[],
    status: [] as string[]
  });

  // Mock historical data with UDISE codes for In School surveys
  const historicalSurveys: Survey[] = [
    {
      id: 'SCH_2025_001',
      name: 'Annual School Infrastructure Audit',
      description: 'Comprehensive assessment of school buildings, classrooms, toilets, drinking water, and playground facilities',
      type: 'In School',
      access: 'Public',
      languages: ['Hindi', 'English'],
      status: 'completed',
      lastModified: '2025-01-05',
      udiseCode: '12345678901'
    },
    {
      id: 'EDU_2025_002',
      name: 'Teacher Training Program Evaluation',
      description: 'Assessment of ongoing teacher professional development initiatives and their impact on classroom teaching',
      type: 'Open',
      access: 'Public',
      languages: ['Hindi', 'Gujarati'],
      status: 'synced',
      lastModified: '2025-01-04'
    },
    {
      id: 'SCH_2025_003',
      name: 'Mid-Day Meal Quality Assessment',
      description: 'Evaluation of nutritional quality, hygiene standards, and student satisfaction with school meal programs',
      type: 'In School',
      access: 'Public',
      languages: ['English'],
      status: 'pending',
      lastModified: '2025-01-03',
      udiseCode: '23456789012'
    },
    {
      id: 'SCH_2025_005',
      name: 'School Safety and Security Audit',
      description: 'Comprehensive evaluation of emergency protocols, fire safety measures, boundary walls, and security arrangements',
      type: 'In School',
      access: 'Public',
      languages: ['Hindi', 'English'],
      status: 'synced',
      lastModified: '2025-01-02',
      udiseCode: '34567890123'
    }
  ];

  // filtering logic, handlers, etc.

  const filteredSurveys = historicalSurveys.filter(survey => {
    const matchesSearch = survey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         survey.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filters.types.length === 0 || filters.types.includes(survey.type);
    const matchesAccess = filters.access.length === 0 || filters.access.includes(survey.access);
    const matchesStatus = filters.status.length === 0 || filters.status.includes(survey.status || '');
    
    // Date filtering
    let matchesDate = true;
    if (dateRange.from && survey.lastModified) {
      const surveyDate = new Date(survey.lastModified);
      matchesDate = surveyDate >= dateRange.from;
    }
    if (dateRange.to && survey.lastModified) {
      const surveyDate = new Date(survey.lastModified);
      matchesDate = matchesDate && surveyDate <= dateRange.to;
    }
    
    return matchesSearch && matchesType && matchesAccess && matchesStatus && matchesDate;
  });

  const handleViewResponse = (surveyId: string) => {
    const survey = historicalSurveys.find(s => s.id === surveyId);
    if (survey) {
      setSelectedSurvey(survey);
    }
  };

  if (selectedSurvey) {
    return <ViewResponse survey={selectedSurvey} onBack={() => setSelectedSurvey(null)} />;
  }

  return (
    <div className="pb-20 pt-4 px-4 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="display-l">My Responses</h1>
      </div>

      {/* Search, Date, and Filter */}
      <div className="space-y-3 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search responses..."
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

        {/* Date Range Picker */}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear dates button */}
        {(dateRange.from || dateRange.to) && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setDateRange({})}
            className="w-full"
          >
            Clear Date Filter
          </Button>
        )}
      </div>

      {/* Active filter chips */}
      {(filters.types.length > 0 || filters.access.length > 0 || filters.status.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {[...filters.types, ...filters.access, ...filters.status].map((filter, index) => (
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
              onView={handleViewResponse}
              isHistory={true}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No responses found</h3>
            <p className="text-muted-foreground">
              {searchQuery || Object.values(filters).some(arr => arr.length > 0) || dateRange.from || dateRange.to
                ? "No responses match your current filters"
                : "You haven't completed any surveys yet"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
