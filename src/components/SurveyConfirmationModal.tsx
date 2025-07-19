import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Download, RefreshCw } from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';
import { generatePDF } from '@/utils/pdfGenerator';
import { toast } from '@/hooks/use-toast';

interface SurveyConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFillAnother: () => void;
  onMySurveys: () => void;
  onDownloadPDF: () => void;
  surveyName: string;
  isOffline?: boolean;
}

const SurveyConfirmationModal: React.FC<SurveyConfirmationModalProps> = ({
  isOpen,
  onClose,
  onFillAnother,
  onMySurveys,
  onDownloadPDF,
  surveyName,
  isOffline = false
}) => {
  const { isOnline } = useNetwork();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Create a mock survey response for PDF generation
      const mockResponse = {
        surveyId: `survey_${Date.now()}`,
        surveyName: surveyName,
        udiseCode: '22446688001',
        schoolName: 'Sample School Name',
        responses: {
          'Question 1': 'Sample Answer 1',
          'Question 2': 'Sample Answer 2',
          'Multiple Choice': ['Option A', 'Option C'],
          'Rating': '4/5',
          'Comments': 'This is a sample survey response for demonstration purposes.'
        },
        completedAt: new Date().toISOString(),
        submittedBy: 'Survey Inspector'
      };

      await generatePDF(mockResponse);
      onDownloadPDF();
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full mx-4 sm:mx-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <DialogTitle className="text-lg sm:text-xl">Response Saved Successfully!</DialogTitle>
          <DialogDescription className="space-y-2 text-sm sm:text-base">
            <p>Your survey response for "{surveyName}" has been saved successfully.</p>
            {(!isOnline || isOffline) && (
              <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 p-2 rounded">
                <Clock size={16} />
                <span className="text-sm">Please sync when online</span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button 
            onClick={handleDownloadPDF} 
            variant="outline" 
            className="w-full" 
            disabled={isGeneratingPDF}
          >
            <Download size={16} className="mr-2" />
            {isGeneratingPDF ? 'Generating PDF...' : 'Download Response PDF'}
          </Button>
          
          <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
            <Button onClick={onFillAnother} variant="outline" className="w-full">
              <RefreshCw size={16} className="mr-2" />
              Fill Another
            </Button>
            <Button onClick={onMySurveys} className="w-full">
              My Surveys
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyConfirmationModal;