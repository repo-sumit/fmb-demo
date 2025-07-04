
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Save, X, CalendarIcon, Upload, Mic } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
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
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'number' | 'dropdown' | 'date' | 'image' | 'video' | 'voice' | 'likert' | 'tabular-dropdown' | 'tabular-text' | 'tabular-checkbox';
  question: string;
  required: boolean;
  options?: string[];
  children?: Question[];
  tableHeaders?: string[];
  tableRows?: string[];
  likertScale?: { min: number; max: number; minLabel: string; maxLabel: string };
}

const SurveyForm: React.FC = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [udiseCode, setUdiseCode] = useState('');

  // Comprehensive demo survey with all question types
  const survey = {
    id: surveyId,
    name: 'Comprehensive School Assessment',
    questions: [
      {
        id: 'school_name',
        type: 'text' as const,
        question: 'What is the name of the school?',
        required: true
      },
      {
        id: 'school_type',
        type: 'dropdown' as const,
        question: 'What type of school is this?',
        required: true,
        options: ['Government Primary', 'Government Secondary', 'Private Primary', 'Private Secondary', 'Aided School']
      },
      {
        id: 'infrastructure_rating',
        type: 'radio' as const,
        question: 'How would you rate the overall school infrastructure?',
        required: true,
        options: ['Excellent', 'Good', 'Fair', 'Poor'],
        children: [
          {
            id: 'infrastructure_issues',
            type: 'checkbox' as const,
            question: 'What specific infrastructure issues need attention? (Select all that apply)',
            required: false,
            options: ['Broken windows', 'Leaking roof', 'Poor lighting', 'Damaged floors', 'Inadequate ventilation']
          }
        ]
      },
      {
        id: 'facilities',
        type: 'checkbox' as const,
        question: 'Which facilities are available? (Select all that apply)',
        required: false,
        options: ['Library', 'Computer Lab', 'Science Lab', 'Playground', 'Toilet', 'Drinking Water', 'Electricity', 'Kitchen for Mid-day Meal']
      },
      {
        id: 'teacher_satisfaction',
        type: 'likert' as const,
        question: 'Rate your satisfaction with teacher training programs',
        required: true,
        likertScale: { min: 1, max: 5, minLabel: 'Very Dissatisfied', maxLabel: 'Very Satisfied' }
      },
      {
        id: 'classroom_resources',
        type: 'tabular-checkbox' as const,
        question: 'Check available resources in each classroom',
        required: false,
        tableHeaders: ['Classroom 1', 'Classroom 2', 'Classroom 3'],
        options: ['Blackboard', 'Projector', 'Books', 'Chairs', 'Tables']
      },
      {
        id: 'student_attendance',
        type: 'tabular-text' as const,
        question: 'Enter student attendance for each grade',
        required: true,
        tableHeaders: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
        tableRows: ['Present', 'Absent']
      },
      {
        id: 'meal_quality',
        type: 'tabular-dropdown' as const,
        question: 'Rate meal quality for each day',
        required: false,
        tableHeaders: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        options: ['Excellent', 'Good', 'Average', 'Poor']
      },
      {
        id: 'visit_date',
        type: 'date' as const,
        question: 'When did you visit the school?',
        required: true
      },
      {
        id: 'school_photo',
        type: 'image' as const,
        question: 'Upload a photo of the school building',
        required: false
      },
      {
        id: 'classroom_video',
        type: 'video' as const,
        question: 'Record a short video of classroom activities',
        required: false
      },
      {
        id: 'principal_interview',
        type: 'voice' as const,
        question: 'Record voice notes from principal interview',
        required: false
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

  const shouldShowChildQuestion = (parentQuestion: Question): boolean => {
    if (!parentQuestion.children) return false;
    const parentResponse = responses[parentQuestion.id];
    return parentResponse && (parentResponse === 'Poor' || parentResponse === 'Fair');
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

    // Save to localStorage for local view response functionality
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

      case 'dropdown':
        return (
          <Select value={value || ''} onValueChange={(val) => handleResponseChange(question.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => handleResponseChange(question.id, date?.toISOString())}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      case 'radio':
        return (
          <div className="space-y-4">
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
            
            {shouldShowChildQuestion(question) && question.children?.map((childQ) => (
              <div key={childQ.id} className="ml-6 mt-4 p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium mb-2 block">
                  {childQ.question}
                  {childQ.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderQuestion(childQ)}
              </div>
            ))}
          </div>
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

      case 'likert':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{question.likertScale?.minLabel}</span>
              <span>{question.likertScale?.maxLabel}</span>
            </div>
            <div className="flex justify-between items-center space-x-2">
              {Array.from({ length: question.likertScale?.max || 5 }, (_, i) => i + 1).map((num) => (
                <div key={num} className="flex flex-col items-center space-y-1">
                  <Label htmlFor={`likert-${num}`} className="text-xs">{num}</Label>
                  <input
                    type="radio"
                    id={`likert-${num}`}
                    name={question.id}
                    value={num}
                    checked={value === num}
                    onChange={() => handleResponseChange(question.id, num)}
                    className="w-4 h-4"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'tabular-text':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-50"></th>
                  {question.tableHeaders?.map((header) => (
                    <th key={header} className="border border-gray-300 p-2 bg-gray-50 text-sm">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.tableRows?.map((row) => (
                  <tr key={row}>
                    <td className="border border-gray-300 p-2 font-medium text-sm">{row}</td>
                    {question.tableHeaders?.map((header) => (
                      <td key={`${row}-${header}`} className="border border-gray-300 p-1">
                        <Input
                          type="text"
                          value={value?.[`${row}-${header}`] || ''}
                          onChange={(e) => {
                            const current = value || {};
                            handleResponseChange(question.id, {
                              ...current,
                              [`${row}-${header}`]: e.target.value
                            });
                          }}
                          className="border-none p-1 text-sm"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'tabular-dropdown':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {question.tableHeaders?.map((header) => (
                    <th key={header} className="border border-gray-300 p-2 bg-gray-50 text-sm">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {question.tableHeaders?.map((header) => (
                    <td key={header} className="border border-gray-300 p-1">
                      <Select
                        value={value?.[header] || ''}
                        onValueChange={(val) => {
                          const current = value || {};
                          handleResponseChange(question.id, {
                            ...current,
                            [header]: val
                          });
                        }}
                      >
                        <SelectTrigger className="border-none text-sm">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options?.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'tabular-checkbox':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 bg-gray-50"></th>
                  {question.tableHeaders?.map((header) => (
                    <th key={header} className="border border-gray-300 p-2 bg-gray-50 text-sm">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.options?.map((option) => (
                  <tr key={option}>
                    <td className="border border-gray-300 p-2 font-medium text-sm">{option}</td>
                    {question.tableHeaders?.map((header) => (
                      <td key={`${option}-${header}`} className="border border-gray-300 p-2 text-center">
                        <Checkbox
                          checked={value?.[`${option}-${header}`] || false}
                          onCheckedChange={(checked) => {
                            const current = value || {};
                            handleResponseChange(question.id, {
                              ...current,
                              [`${option}-${header}`]: checked
                            });
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'image':
      case 'video':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-sm text-gray-600 mb-2">
              Click to upload {question.type === 'image' ? 'an image' : 'a video'} or drag and drop
            </div>
            <input
              type="file"
              accept={question.type === 'image' ? 'image/*' : 'video/*'}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleResponseChange(question.id, file.name);
                }
              }}
              className="hidden"
              id={`file-${question.id}`}
            />
            <label
              htmlFor={`file-${question.id}`}
              className="cursor-pointer text-primary hover:text-primary/80"
            >
              Browse files
            </label>
            {value && (
              <div className="mt-2 text-sm text-green-600">
                Selected: {value}
              </div>
            )}
          </div>
        );

      case 'voice':
        return (
          <div className="border border-gray-300 rounded-lg p-4 text-center">
            <Mic className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <Button
              variant="outline"
              onClick={() => {
                // Mock voice recording
                handleResponseChange(question.id, 'voice_recording_' + Date.now());
                toast({
                  title: "Voice Recording",
                  description: "Voice recording functionality would be implemented here.",
                });
              }}
            >
              {value ? 'Re-record' : 'Start Recording'}
            </Button>
            {value && (
              <div className="mt-2 text-sm text-green-600">
                Recording saved: {value}
              </div>
            )}
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
              <Label htmlFor="udise">School UDISE Code <span className="text-red-500">*</span></Label>
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
      <div className="p-4 max-w-4xl mx-auto">
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
