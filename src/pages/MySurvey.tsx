import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, Filter, BookOpen, Clock, Users, Sparkles } from 'lucide-react';
import SurveyCard from '@/components/SurveyCard';
import FilterSheet from '@/components/FilterSheet';
import ProfileButton from '@/components/ProfileButton';
import NetworkToggle from '@/components/NetworkToggle';
import { useNetwork } from '@/contexts/NetworkContext';

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: number;
  estimatedTime: string;
  status: 'draft' | 'active' | 'completed';
  responses: number;
  dueDate: string;
  tags: string[];
  isDownloaded?: boolean;
}

const MySurvey: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline } = useNetwork();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    types: [] as string[],
    access: [] as string[],
    status: [] as string[]
  });
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: '1',
      title: 'School Infrastructure Assessment',
      description: 'Comprehensive evaluation of school facilities and infrastructure',
      questions: 25,
      estimatedTime: '15 min',
      status: 'active',
      responses: 47,
      dueDate: '2024-01-15',
      tags: ['Infrastructure', 'Facilities'],
      isDownloaded: true
    },
    {
      id: '2',
      title: 'Teacher Training Needs Analysis',
      description: 'Assessment of professional development requirements',
      questions: 18,
      estimatedTime: '12 min',
      status: 'active',
      responses: 23,
      dueDate: '2024-01-20',
      tags: ['Training', 'Professional Development'],
      isDownloaded: false
    },
    {
      id: '3',
      title: 'Student Learning Outcomes',
      description: 'Evaluation of academic performance and learning metrics',
      questions: 30,
      estimatedTime: '20 min',
      status: 'draft',
      responses: 0,
      dueDate: '2024-01-25',
      tags: ['Academic', 'Performance'],
      isDownloaded: false
    },
    {
      id: '4',
      title: 'Digital Literacy Survey',
      description: 'Assessment of technology integration in education',
      questions: 22,
      estimatedTime: '18 min',
      status: 'completed',
      responses: 156,
      dueDate: '2023-12-30',
      tags: ['Technology', 'Digital Skills'],
      isDownloaded: true
    }
  ]);

  const handleDownloadToggle = (surveyId: string) => {
    setSurveys(surveys.map(survey => 
      survey.id === surveyId 
        ? { ...survey, isDownloaded: !survey.isDownloaded }
        : survey
    ));
  };

  // Filter surveys based on network status
  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!isOnline) {
      return matchesSearch && survey.isDownloaded;
    }
    
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-green-500 to-emerald-600';
      case 'draft': return 'bg-gradient-to-r from-yellow-500 to-orange-600';
      case 'completed': return 'bg-gradient-to-r from-blue-500 to-purple-600';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 gradient-primary rounded-full opacity-10 floating"></div>
        <div className="absolute top-40 right-20 w-24 h-24 gradient-accent rounded-full opacity-10 floating" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 gradient-secondary rounded-full opacity-10 floating" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 gradient-primary rounded-full opacity-10 rotate-slow"></div>
      </div>

      <div className="relative z-10 p-6 pb-20">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Top row with network toggle and profile */}
          <div className="flex justify-between items-center">
            <NetworkToggle />
            <ProfileButton />
          </div>

          {/* Title and subtitle */}
          <div className="text-center slide-up">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-purple-400 floating" />
              <h1 className="text-3xl font-bold gradient-text">My Surveys</h1>
            </div>
            <p className="text-muted-foreground">
              {isOnline ? 'Manage and track your survey collection' : 'Offline mode - showing downloaded surveys only'}
            </p>
          </div>

          {/* Search and filters */}
          <div className="flex gap-3 bounce-in">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search surveys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-card border-purple-300/20 focus:border-purple-400 hover-glow"
              />
            </div>
            <FilterSheet 
              filters={filters} 
              onFiltersChange={setFilters}
            >
              <Button variant="outline" size="icon" className="glass-card border-purple-300/20 hover-glow">
                <Filter className="w-4 h-4" />
              </Button>
            </FilterSheet>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4 slide-up" style={{animationDelay: '0.2s'}}>
            <div className="glass-card rounded-xl p-4 text-center hover-lift glow">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-lg font-bold gradient-text">{surveys.length}</div>
              <div className="text-xs text-muted-foreground">Total Surveys</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center hover-lift glow">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-lg font-bold gradient-text">{surveys.filter(s => s.status === 'active').length}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="glass-card rounded-xl p-4 text-center hover-lift glow">
              <Users className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-lg font-bold gradient-text">{surveys.reduce((acc, s) => acc + s.responses, 0)}</div>
              <div className="text-xs text-muted-foreground">Responses</div>
            </div>
          </div>
        </div>

        {/* Survey Grid */}
        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="space-y-4">
            {filteredSurveys.length === 0 ? (
              <div className="text-center py-12 bounce-in">
                <div className="w-24 h-24 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center opacity-20">
                  <BookOpen className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-medium gradient-text mb-2">
                  {!isOnline && surveys.length > 0 ? 'No downloaded surveys' : 'No surveys found'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {!isOnline && surveys.length > 0 
                    ? 'Download surveys while online to access them offline'
                    : searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Create your first survey to get started'
                  }
                </p>
              </div>
            ) : (
              filteredSurveys.map((survey, index) => (
                <div 
                  key={survey.id} 
                  className="slide-up hover-lift"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <SurveyCard
                    survey={survey}
                    onDownload={() => handleDownloadToggle(survey.id)}
                    className="glass-card hover-glow border-purple-300/20"
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Floating Add Button */}
        {isOnline && (
          <Button
            onClick={() => navigate('/add-survey')}
            className="fixed bottom-20 right-6 w-14 h-14 rounded-full gradient-primary shadow-2xl glow floating hover-lift z-20"
            size="icon"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MySurvey;
