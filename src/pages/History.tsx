
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyCard, { Survey } from '@/components/SurveyCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const History: React.FC = () => {
  const navigate = useNavigate();

  // Mock history data with education-focused surveys
  const [historyItems] = useState<Survey[]>([
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
    }
  ]);

  const handleViewResponse = (surveyId: string) => {
    // Check if response exists in local storage
    const localResponse = localStorage.getItem(`response_${surveyId}`);
    
    if (localResponse) {
      try {
        const response = JSON.parse(localResponse);
        // Navigate to a view response page or show modal with data
        toast({
          title: "Response Found",
          description: `Survey completed on ${new Date(response.completedAt).toLocaleDateString()}. Local data displayed.`,
        });
        
        // For demo purposes, log the response data
        console.log('Survey Response:', response);
        
        // In a real app, you would navigate to a dedicated view page
        // navigate(`/view-response/${surveyId}`);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load response data.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "No Local Data",
        description: "Response data not found in local storage.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="pb-20 pt-4 px-4 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center mb-6">
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

      {/* Summary */}
      <div className="bg-primary/5 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-primary" />
          <span className="font-medium">Response History</span>
        </div>
        <p className="body text-muted-foreground">
          Total completed: {historyItems.length} surveys
        </p>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {historyItems.length > 0 ? (
          historyItems.map((item) => (
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
            <h3 className="font-semibold mb-2">No responses yet</h3>
            <p className="text-muted-foreground">
              Complete surveys to see your response history here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
