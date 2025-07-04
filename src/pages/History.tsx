
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyCard, { Survey } from '@/components/SurveyCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';

const History: React.FC = () => {
  const navigate = useNavigate();

  // Mock history data
  const [historyItems] = useState<Survey[]>([
    {
      id: 'SCH_2025_001',
      name: 'Annual School Audit',
      description: 'Comprehensive assessment of school infrastructure, teaching quality, and student outcomes',
      type: 'School',
      access: 'Public',
      languages: ['Hindi', 'English'],
      status: 'synced',
      lastModified: '4 Jul 2025, 10:42 AM'
    },
    {
      id: 'HLT_2025_002',
      name: 'Primary Health Center Survey',
      description: 'Evaluation of healthcare facilities and service delivery in rural areas',
      type: 'Health',
      access: 'Private',
      languages: ['Hindi', 'Gujarati'],
      status: 'pending',
      lastModified: '3 Jul 2025, 3:15 PM'
    },
    {
      id: 'INF_2025_003',
      name: 'Water & Sanitation Assessment',
      description: 'Infrastructure survey focusing on water supply and sanitation facilities',
      type: 'Infrastructure',
      access: 'Public',
      languages: ['English'],
      status: 'sync-error',
      lastModified: '2 Jul 2025, 11:30 AM'
    }
  ]);

  const handleViewResponse = (surveyId: string) => {
    // In real app, navigate to response view
    console.log(`Viewing response for survey: ${surveyId}`);
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
