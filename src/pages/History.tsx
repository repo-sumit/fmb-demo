import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyCard, { Survey } from '@/components/SurveyCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Clock, Filter, Calendar as CalendarIcon, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface FilterOptions {
  types: string[];
  status: string[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const History: React.FC = () => {
  const navigate = useNavigate();

  // Mock history data with education-focused surveys
  const [allHistoryItems] = useState<Survey[]>([
    {
      id: 'SCH_2025_001',
      name: 'Annual School Infrastructure Audit',
      description: 'Comprehensive assessment of school buildings, classrooms, toilets, drinking water, and playground facilities',
      type: 'In School',
      access: 'Public',
      languages: ['Hindi', 'English'],
      status: 'synced',
      lastModified: '4 Jul 2025, 10:42 AM'
    },
    {
      id: 'EDU_2025_002',
      name: 'Teacher Training Program Evaluation',
      description: 'Assessment of ongoing teacher professional development initiatives and their impact on classroom teaching',
      type: 'Open',
      access: 'Public',
      languages: ['Hindi', 'Gujarati'],
      status: 'pending',
      lastModified: '3 Jul 2025, 3:15 PM'
    },
    {
      id: 'SCH_2025_003',
      name: 'Mid-Day Meal Quality Assessment',
      description: 'Evaluation of nutritional quality, hygiene standards, and student satisfaction with school meal programs',
      type: 'In School',
      access: 'Public',
      languages: ['English'],
      status: 'sync-error',
      lastModified: '2 Jul 2025, 11:30 AM'
    },
    {
      id: 'EDU_2025_004',
      name: 'Digital Learning Resources Survey',
      description: 'Assessment of available technology and digital learning tools in schools',
      type: 'Open',
      access: 'Public',
      languages: ['Hindi', 'English'],
      status: 'synced',
      lastModified: '1 Jul 2025, 2:20 PM'
    },
    {
      id: 'SCH_2025_005',
      name: 'Student Enrollment and Attendance Tracking',
      description: 'Monthly survey to track student enrollment patterns and attendance rates',
      type: 'In School',
      access: 'Private',
      languages: ['Hindi'],
      status: 'completed',
      lastModified: '30 Jun 2025, 9:15 AM'
    }
  ]);

  const [filters, setFilters] = useState<FilterOptions>({
    types: [],
    status: [],
    dateRange: { from: undefined, to: undefined }
  });

  const [filteredItems, setFilteredItems] = useState<Survey[]>(allHistoryItems);

  // Dummy response data generator
  const generateDummyResponse = (surveyId: string, surveyName: string) => {
    const dummyData = {
      surveyId,
      surveyName,
      completedAt: new Date().toISOString(),
      responses: [
        {
          questionId: 'q1',
          question: 'School Name',
          type: 'text',
          answer: 'Government Primary School, Village Rampur'
        },
        {
          questionId: 'q2',
          question: 'UDISE Code',
          type: 'text',
          answer: '12345678901'
        },
        {
          questionId: 'q3',
          question: 'Number of Students',
          type: 'number',
          answer: '245'
        },
        {
          questionId: 'q4',
          question: 'School Infrastructure Rating',
          type: 'multiple_choice_single',
          answer: 'Good',
          options: ['Excellent', 'Good', 'Average', 'Poor']
        },
        {
          questionId: 'q5',
          question: 'Available Facilities',
          type: 'multiple_choice_multi',
          answer: ['Library', 'Computer Lab', 'Playground'],
          options: ['Library', 'Computer Lab', 'Science Lab', 'Playground', 'Kitchen', 'Medical Room']
        },
        {
          questionId: 'q6',
          question: 'Last Inspection Date',
          type: 'date',
          answer: '2025-06-15'
        },
        {
          questionId: 'q7',
          question: 'Overall Satisfaction',
          type: 'likert',
          answer: '4',
          scale: '1-5 (Very Dissatisfied to Very Satisfied)'
        }
      ],
      location: {
        latitude: 26.9124,
        longitude: 75.7873,
        address: 'Village Rampur, Rajasthan'
      },
      syncStatus: 'synced',
      submittedBy: 'Surveyor ID: ABC123'
    };

    return dummyData;
  };

  const handleViewResponse = (surveyId: string) => {
    const survey = allHistoryItems.find(s => s.id === surveyId);
    if (survey) {
      const dummyResponse = generateDummyResponse(surveyId, survey.name);
      
      // Store in localStorage for persistence
      localStorage.setItem(`response_${surveyId}`, JSON.stringify(dummyResponse));
      
      // Show summary in toast
      toast({
        title: "Survey Response",
        description: `Loaded response for ${survey.name}. Check console for full data.`,
      });
      
      // Log detailed response data
      console.log('=== SURVEY RESPONSE DETAILS ===');
      console.log('Survey:', survey.name);
      console.log('ID:', surveyId);
      console.log('Completed:', dummyResponse.completedAt);
      console.log('Responses:', dummyResponse.responses);
      console.log('Location:', dummyResponse.location);
      console.log('================================');
    }
  };

  const applyFilters = () => {
    let filtered = allHistoryItems;

    // Filter by type
    if (filters.types.length > 0) {
      filtered = filtered.filter(item => filters.types.includes(item.type));
    }

    // Filter by status
    if (filters.status.length > 0) {
      filtered = filtered.filter(item => 
        item.status && filters.status.includes(item.status)
      );
    }

    // Filter by date range
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(item => {
        if (!item.lastModified) return false;
        
        try {
          // Parse the date string "4 Jul 2025, 10:42 AM" format
          const dateParts = item.lastModified.split(', ');
          const dateStr = dateParts[0];
          const [day, month, year] = dateStr.split(' ');
          const monthMap: { [key: string]: string } = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
            'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
            'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
          };
          const isoDate = `${year}-${monthMap[month]}-${day.padStart(2, '0')}`;
          const itemDate = parseISO(isoDate);

          if (filters.dateRange.from && filters.dateRange.to) {
            return isWithinInterval(itemDate, {
              start: filters.dateRange.from,
              end: filters.dateRange.to
            });
          } else if (filters.dateRange.from) {
            return itemDate >= filters.dateRange.from;
          } else if (filters.dateRange.to) {
            return itemDate <= filters.dateRange.to;
          }
        } catch (error) {
          console.error('Date parsing error:', error);
          return true;
        }
        return true;
      });
    }

    setFilteredItems(filtered);
  };

  React.useEffect(() => {
    applyFilters();
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      types: [],
      status: [],
      dateRange: { from: undefined, to: undefined }
    });
  };

  const getTotalFilterCount = () => {
    let count = filters.types.length + filters.status.length;
    if (filters.dateRange.from || filters.dateRange.to) count += 1;
    return count;
  };

  const filterSections = [
    {
      title: 'Survey Type',
      key: 'types' as keyof Pick<FilterOptions, 'types' | 'status'>,
      options: ['Open', 'In School']
    },
    {
      title: 'Sync Status',
      key: 'status' as keyof Pick<FilterOptions, 'types' | 'status'>,
      options: ['synced', 'pending', 'sync-error', 'completed']
    }
  ];

  const handleFilterToggle = (section: keyof Pick<FilterOptions, 'types' | 'status'>, option: string) => {
    setFilters(prev => ({
      ...prev,
      [section]: prev[section].includes(option)
        ? prev[section].filter(item => item !== option)
        : [...prev[section], option]
    }));
  };

  return (
    <div className="pb-20 pt-4 px-4 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="display-l">My Responses</h1>
        </div>

        {/* Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <div className="relative">
              <Button variant="outline" size="icon">
                <Filter size={20} />
              </Button>
              {getTotalFilterCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                  {getTotalFilterCount()}
                </Badge>
              )}
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filter Responses</SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Date Range Filter */}
              <div>
                <h4 className="font-medium mb-3">Date Range</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">From</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !filters.dateRange.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.dateRange.from ? (
                              format(filters.dateRange.from, "dd MMM yyyy")
                            ) : (
                              <span>Pick date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.from}
                            onSelect={(date) => setFilters(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, from: date }
                            }))}
                            className="pointer-events-auto"
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">To</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !filters.dateRange.to && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.dateRange.to ? (
                              format(filters.dateRange.to, "dd MMM yyyy")
                            ) : (
                              <span>Pick date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.to}
                            onSelect={(date) => setFilters(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, to: date }
                            }))}
                            className="pointer-events-auto"
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  {(filters.dateRange.from || filters.dateRange.to) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        dateRange: { from: undefined, to: undefined }
                      }))}
                      className="text-muted-foreground"
                    >
                      <X className="mr-1 h-3 w-3" />
                      Clear dates
                    </Button>
                  )}
                </div>
              </div>

              {/* Other Filters */}
              {filterSections.map((section) => (
                <div key={section.key}>
                  <h4 className="font-medium mb-3">{section.title}</h4>
                  <div className="space-y-2">
                    {section.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${section.key}-${option}`}
                          checked={filters[section.key].includes(option)}
                          onCheckedChange={() => handleFilterToggle(section.key, option)}
                        />
                        <label
                          htmlFor={`${section.key}-${option}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                        >
                          {option === 'sync-error' ? 'Sync Error' : option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={clearFilters} className="flex-1">
                Clear All
              </Button>
              <Button onClick={() => {}} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Summary */}
      <div className="bg-primary/5 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-primary" />
          <span className="font-medium">Response History</span>
        </div>
        <p className="body text-muted-foreground">
          Showing {filteredItems.length} of {allHistoryItems.length} completed surveys
          {getTotalFilterCount() > 0 && ` (${getTotalFilterCount()} filter${getTotalFilterCount() > 1 ? 's' : ''} applied)`}
        </p>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <SurveyCard
              key={item.id}
              survey={item}
              onView={handleViewResponse}
              isHistory={true}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">
              {getTotalFilterCount() > 0 ? "No responses match filters" : "No responses yet"}
            </h3>
            <p className="text-muted-foreground">
              {getTotalFilterCount() > 0 
                ? "Try adjusting your filters to see more results"
                : "Complete surveys to see your response history here"
              }
            </p>
            {getTotalFilterCount() > 0 && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
