
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Users, 
  Calendar, 
  FileText, 
  Download, 
  CheckCircle,
  Play,
  Eye,
  Sparkles
} from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';

interface Survey {
  id: string;
  title?: string;
  name?: string;
  description: string;
  questions?: number;
  estimatedTime?: string;
  status?: 'draft' | 'active' | 'completed' | 'synced' | 'pending';
  responses?: number;
  dueDate?: string;
  lastModified?: string;
  tags?: string[];
  languages?: string[];
  type?: 'Open' | 'In School';
  access?: 'Public' | 'Private';
  udiseCode?: string;
  isDownloaded?: boolean;
}

interface SurveyCardProps {
  survey: Survey;
  onDownload?: () => void;
  onAction?: (surveyId: string) => void;
  actionLabel?: string;
  isHistory?: boolean;
  className?: string;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ 
  survey, 
  onDownload, 
  onAction, 
  actionLabel = 'View Survey',
  isHistory = false,
  className = '' 
}) => {
  const navigate = useNavigate();
  const { isOnline } = useNetwork();
  const [isDownloading, setIsDownloading] = useState(false);

  // Get display title - prioritize 'title' over 'name'
  const displayTitle = survey.title || survey.name || 'Untitled Survey';
  
  // Get display tags - use tags if available, otherwise create from other properties
  const displayTags = survey.tags || [];
  if (displayTags.length === 0 && !isHistory) {
    // For non-history cards, we might have default tags
    if (survey.status) displayTags.push(survey.status);
  }
  if (survey.type) displayTags.push(survey.type);
  if (survey.access) displayTags.push(survey.access);
  if (survey.languages) displayTags.push(...survey.languages);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-600';
      case 'draft': return 'from-yellow-500 to-orange-600';
      case 'completed': 
      case 'synced': return 'from-blue-500 to-purple-600';
      case 'pending': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = getStatusColor(status);
    return `bg-gradient-to-r ${colors} text-white border-0`;
  };

  const handleDownload = async () => {
    if (survey.isDownloaded || !onDownload) return;
    
    setIsDownloading(true);
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDownloading(false);
    onDownload();
  };

  const handleSurveyClick = () => {
    if (onAction) {
      onAction(survey.id);
    } else if (survey.status === 'draft') {
      navigate(`/survey-form/${survey.id}`);
    } else {
      navigate(`/survey/${survey.id}`);
    }
  };

  const canAccess = isOnline || survey.isDownloaded;

  return (
    <div className={`glass-card rounded-xl p-6 hover-glow transition-all duration-300 ${!canAccess ? 'opacity-50' : ''} ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg gradient-text line-clamp-1">
              {displayTitle}
            </h3>
            {survey.isDownloaded && (
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full glow"></div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {survey.description}
          </p>
        </div>
        {survey.status && (
          <Badge className={`${getStatusBadge(survey.status)} capitalize shimmer hover-lift`}>
            {survey.status}
          </Badge>
        )}
      </div>

      {/* Tags */}
      {displayTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {displayTags.map((tag, index) => (
            <Badge 
              key={`${tag}-${index}`}
              variant="secondary" 
              className="text-xs glass-card border-purple-300/20 hover-glow bounce-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {survey.questions !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4 text-purple-400 floating" />
            <span>{survey.questions} questions</span>
          </div>
        )}
        {survey.estimatedTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-blue-400 pulse-slow" />
            <span>{survey.estimatedTime}</span>
          </div>
        )}
        {survey.responses !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-green-400" />
            <span>{survey.responses} responses</span>
          </div>
        )}
        {(survey.dueDate || survey.lastModified) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>
              {survey.dueDate 
                ? `Due ${new Date(survey.dueDate).toLocaleDateString()}`
                : `Modified ${new Date(survey.lastModified!).toLocaleDateString()}`
              }
            </span>
          </div>
        )}
        {survey.udiseCode && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>UDISE: {survey.udiseCode}</span>
          </div>
        )}
      </div>

      {/* Progress for completed surveys */}
      {survey.status === 'completed' && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Response Rate</span>
            <span className="gradient-text font-medium">85%</span>
          </div>
          <Progress value={85} className="h-2">
            <div className="h-full gradient-primary rounded-full transition-all duration-500"></div>
          </Progress>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-purple-300/20">
        {/* Main Action Button */}
        <Button
          onClick={handleSurveyClick}
          disabled={!canAccess}
          className="flex-1 gradient-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
        >
          {isHistory ? (
            <>
              <Eye className="w-4 h-4 mr-2" />
              {actionLabel}
            </>
          ) : survey.status === 'draft' ? (
            <>
              <Play className="w-4 h-4 mr-2" />
              Edit Survey
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              View Survey
            </>
          )}
        </Button>

        {/* Download Button (only show when online and onDownload is provided) */}
        {isOnline && onDownload && (
          <Button
            onClick={handleDownload}
            disabled={survey.isDownloaded || isDownloading}
            variant="outline"
            size="icon"
            className={`glass-card border-purple-300/20 hover-glow transition-all duration-300 ${
              survey.isDownloaded 
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30' 
                : 'hover:border-purple-400/50'
            }`}
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            ) : survey.isDownloaded ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* Offline indicator */}
      {!isOnline && !survey.isDownloaded && (
        <div className="mt-3 p-2 glass-card border border-orange-400/30 rounded-lg text-center">
          <p className="text-xs text-orange-400">
            <Sparkles className="w-3 h-3 inline mr-1" />
            Go online to access this survey
          </p>
        </div>
      )}
    </div>
  );
};

export default SurveyCard;
