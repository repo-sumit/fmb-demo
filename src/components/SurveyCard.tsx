
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ArrowDown } from 'lucide-react';

export interface Survey {
  id: string;
  name: string;
  description: string;
  type: 'School' | 'Health' | 'Infrastructure';
  access: 'Public' | 'Private';
  languages: string[];
  status?: 'completed' | 'pending' | 'synced' | 'sync-error';
  lastModified?: string;
  progress?: number;
}

interface SurveyCardProps {
  survey: Survey;
  onStart?: (surveyId: string) => void;
  onResume?: (surveyId: string) => void;
  onAdd?: (surveyId: string) => void;
  onView?: (surveyId: string) => void;
  showAddButton?: boolean;
  isHistory?: boolean;
}

const SurveyCard: React.FC<SurveyCardProps> = ({
  survey,
  onStart,
  onResume,
  onAdd,
  onView,
  showAddButton = false,
  isHistory = false
}) => {
  const getStatusBadge = () => {
    if (!survey.status) return null;

    const statusConfig = {
      completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800' },
      pending: { label: 'Pending Sync', className: 'bg-yellow-100 text-yellow-800', icon: <ArrowDown size={12} /> },
      synced: { label: 'Synced', className: 'bg-green-100 text-green-800', icon: <Check size={12} /> },
      'sync-error': { label: 'Sync Error', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[survey.status];
    
    return (
      <Badge variant="secondary" className={`${config.className} gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getActionButton = () => {
    if (showAddButton) {
      return (
        <Button 
          onClick={() => onAdd?.(survey.id)}
          className="w-full mt-4"
        >
          Add Survey
        </Button>
      );
    }

    if (isHistory) {
      const canView = survey.status === 'synced' || survey.status === 'completed';
      return (
        <Button 
          onClick={() => onView?.(survey.id)}
          disabled={!canView}
          variant={canView ? "default" : "secondary"}
          className="w-full mt-4"
        >
          {canView ? 'View Response' : 'Pending Sync'}
        </Button>
      );
    }

    if (survey.progress && survey.progress > 0) {
      return (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress: {survey.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${survey.progress}%` }}
            />
          </div>
          <Button 
            onClick={() => onResume?.(survey.id)}
            className="w-full"
          >
            Resume Survey
          </Button>
        </div>
      );
    }

    return (
      <Button 
        onClick={() => onStart?.(survey.id)}
        className="w-full mt-4"
      >
        Start Survey
      </Button>
    );
  };

  return (
    <Card className="slide-in hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with status */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="caption text-muted-foreground mb-1">{survey.id}</p>
              <h3 className="font-semibold text-base leading-tight">{survey.name}</h3>
            </div>
            {getStatusBadge()}
          </div>

          {/* Description */}
          <p className="body text-muted-foreground">{survey.description}</p>

          {/* Languages */}
          <div className="flex flex-wrap gap-1.5">
            {survey.languages.map((lang) => (
              <Badge key={lang} variant="outline" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>

          {/* Type and Access badges */}
          <div className="flex gap-2">
            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              {survey.type}
            </Badge>
            <Badge variant="outline">
              {survey.access}
            </Badge>
          </div>

          {/* Last modified for history items */}
          {isHistory && survey.lastModified && (
            <p className="caption text-muted-foreground">
              Last synced: {survey.lastModified}
            </p>
          )}

          {/* Action button */}
          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyCard;
