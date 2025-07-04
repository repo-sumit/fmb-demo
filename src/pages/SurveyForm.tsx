
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Question {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'number';
  question: string;
  required: boolean;
  options?: string[];
}

const SurveyForm: React.FC = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [udiseCode, setUdiseCode] = useState('');

  // Mock survey data
  const survey = {
    id: surveyId,
    name: 'Annual School Audit',
    questions: [
      {
        id: 'school_name',
        type: 'text' as const,
        question: 'What is the name of the school?',
        required: true
      },
      {
        id: 'infrastructure_rating',
        type: 'radio' as const,
        question: 'How would you rate the school infrastructure?',
        required: true,
        options: ['Excellent', 'Good', 'Fair', 'Poor']
      },
      {
        id: 'facilities',
        type: 'checkbox' as const,
        question: 'Which facilities are available? (Select all that apply)',
        required: false,
        options: ['Library', 'Computer Lab', 'Science Lab', 'Playground', 'Toilet', 'Drinking Water']
      },
      {
        id: 'student_count',
        type: 'number' as const,
        question: 'Total number of enrolled students',
        required: true
      },
      {
        id: 'observations',
        type: 'textarea' as const,
        question: 'Additional observations and recommendations',
        required: false
      }
    ] as Question[]
  };

  const totalQuestions = survey.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Auto-save responses
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(`survey_${surveyId}`, JSON.stringify(responses));
    }, 1000);

    return () => clearTimeout(timer);
  }, [responses, surveyId]);

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    const question = survey.questions[currentQuestion];
    if (question.required && !responses[question.id]) {
      toast({
        title: "Required Field",
        description: "Please answer this question before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Check if all required questions are answered
    const unansweredRequired = survey.questions
      .filter(q => q.required && !responses[q.id])
      .map(q => q.question);

    if (unansweredRequired.length > 0) {
      toast({
        title: "Incomplete Survey",
        description: `Please answer all required questions: ${unansweredRequired[0]}`,
        variant: "destructive"
      });
      return;
    }

    // Simulate offline save and sync
    const surveyResponse = {
      surveyId,
      udiseCode,
      responses,
      completedAt: new Date().toISOString(),
      status: 'pending' // Will be synced when online
    };

    localStorage.setItem(`response_${surveyId}`, JSON.stringify(surveyResponse));
    
    toast({
      title: "Survey Submitted",
      description: "Your responses have been saved and will sync when online.",
    });

    navigate('/');
  };

  const handleDiscard = () => {
    localStorage.removeItem(`survey_${surveyId}`);
    setShowDiscardDialog(false);
    navigate('/');
  };

  const renderQuestion = (question: Question) => {
    const value = responses[question.id];

    switch (question.type) {
      case 'text':
      case 'number':
        return (
          <Input
            type={question.type}
            value={value || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            rows={4}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={(val) => handleResponseChange(question.id, val)}
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const current = value || [];
                    const updated = checked
                      ? [...current, option]
                      : current.filter((item: string) => item !== option);
                    handleResponseChange(question.id, updated);
                  }}
                />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (currentQuestion === -1) {
    // UDISE Code entry screen
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto pt-12">
          <h1 className="display-l mb-6">Enter UDISE Code</h1>
          <div className="space-y-4">
            <div>
              <Label htmlFor="udise">School UDISE Code *</Label>
              <Input
                id="udise"
                value={udiseCode}
                onChange={(e) => setUdiseCode(e.target.value)}
                placeholder="e.g., 24010101234"
              />
            </div>
            <Button
              onClick={() => setCurrentQuestion(0)}
              disabled={!udiseCode}
              className="w-full"
            >
              Start Survey
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = survey.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="text-center">
            <p className="caption text-muted-foreground">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
            <h1 className="font-semibold">{survey.name}</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDiscardDialog(true)}
          >
            <X size={20} />
          </Button>
        </div>
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-4 max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {currentQ.question}
            {currentQ.required && <span className="text-red-500 ml-1">*</span>}
          </h2>
          {renderQuestion(currentQ)}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            Previous
          </Button>
          
          {currentQuestion === totalQuestions - 1 ? (
            <Button onClick={handleSubmit} className="flex-1">
              Submit Survey
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1">
              Next
            </Button>
          )}
        </div>

        {/* Auto-save indicator */}
        <p className="caption text-muted-foreground text-center mt-4">
          <Save size={12} className="inline mr-1" />
          Responses saved automatically
        </p>
      </div>

      {/* Discard Dialog */}
      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard Survey?</DialogTitle>
            <DialogDescription>
              All your responses will be lost. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDiscardDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDiscard}>
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SurveyForm;
