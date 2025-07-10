import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, User, Calendar, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNetwork } from '@/contexts/NetworkContext';

interface ViewResponseProps {
  surveyId: string;
  surveyName: string;
  onBack: () => void;
}

const ViewResponse: React.FC<ViewResponseProps> = ({ surveyId, surveyName, onBack }) => {
  const { isOnline } = useNetwork();
  
  // Sample response data
  const responseData = {
    surveyInfo: {
      id: surveyId,
      name: surveyName,
      completedAt: '4 Jul 2025, 10:42 AM',
      submittedBy: 'Anita Sharma (ANT_123)',
      location: 'Government Primary School, Village Rampur',
      udiseCode: '12345678901'
    },
    responses: [
      {
        id: 'q1',
        question: 'School Name',
        type: 'text',
        answer: 'Government Primary School, Village Rampur'
      },
      {
        id: 'q2',
        question: 'UDISE Code',
        type: 'text',
        answer: '12345678901'
      },
      {
        id: 'q3',
        question: 'Number of Students',
        type: 'number',
        answer: '245'
      },
      {
        id: 'q4',
        question: 'School Infrastructure Rating',
        type: 'single_choice',
        answer: 'Good',
        options: ['Excellent', 'Good', 'Average', 'Poor']
      },
      {
        id: 'q5',
        question: 'Available Facilities',
        type: 'multi_choice',
        answer: ['Library', 'Computer Lab', 'Playground'],
        options: ['Library', 'Computer Lab', 'Science Lab', 'Playground', 'Kitchen', 'Medical Room']
      },
      {
        id: 'q6',
        question: 'Last Inspection Date',
        type: 'date',
        answer: '2025-06-15'
      },
      {
        id: 'q7',
        question: 'Overall Satisfaction',
        type: 'likert',
        answer: '4',
        scale: '1-5 (Very Dissatisfied to Very Satisfied)'
      }
    ]
  };

  const handleDownloadResponse = () => {
    if (!isOnline) {
      toast({
        title: "Download Unavailable",
        description: "You need to be online to download survey responses.",
        variant: "destructive"
      });
      return;
    }

    // Simulate download
    toast({
      title: "Download Started",
      description: "Preparing survey response for download...",
    });

    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${surveyName} response downloaded for ${responseData.surveyInfo.udiseCode}.`,
      });
    }, 1500);
  };

  const renderResponse = (response: any) => {
    switch (response.type) {
      case 'single_choice':
        return (
          <div className="space-y-2">
            <div className="space-y-1">
              {response.options?.map((option: string) => (
                <div key={option} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    response.answer === option ? 'bg-primary border-primary' : 'border-gray-300'
                  }`} />
                  <span className={response.answer === option ? 'font-medium text-primary' : 'text-gray-600'}>
                    {option}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'multi_choice':
        return (
          <div className="space-y-2">
            <div className="space-y-1">
              {response.options?.map((option: string) => (
                <div key={option} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded border ${
                    response.answer.includes(option) ? 'bg-primary border-primary' : 'border-gray-300'
                  }`} />
                  <span className={response.answer.includes(option) ? 'font-medium text-primary' : 'text-gray-600'}>
                    {option}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'likert':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Scale: {response.scale}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-primary">{response.answer}</span>
              <span className="text-gray-600">/ 5</span>
            </div>
          </div>
        );
      
      case 'date':
        return (
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-500" />
            <span className="font-medium">{new Date(response.answer).toLocaleDateString()}</span>
          </div>
        );
      
      default:
        return <span className="font-medium">{response.answer}</span>;
    }
  };

  return (
    <div className="pb-20 pt-4 px-4 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="display-l">Survey Response</h1>
      </div>

      {/* Survey Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{responseData.surveyInfo.name}</CardTitle>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Calendar size={14} />
              <span>Completed: {responseData.surveyInfo.completedAt}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User size={14} />
              <span>By: {responseData.surveyInfo.submittedBy}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={14} />
              <span>{responseData.surveyInfo.location}</span>
            </div>
          </div>
          <Badge className="w-fit bg-green-100 text-green-800">
            Synced
          </Badge>
        </CardHeader>
      </Card>

      {/* Responses */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Responses</h2>
        {responseData.responses.map((response, index) => (
          <Card key={response.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-base">{response.question}</h3>
                  <Badge variant="outline" className="text-xs">
                    Q{index + 1}
                  </Badge>
                </div>
                <div className="pl-0">
                  {renderResponse(response)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Download Button - Only show in online mode */}
      {isOnline && (
        <div className="mt-6 mb-8">
          <Button 
            onClick={handleDownloadResponse}
            className="w-full"
            variant="outline"
          >
            <Download size={16} className="mr-2" />
            Download Response
          </Button>
        </div>
      )}
    </div>
  );
};

export default ViewResponse;
