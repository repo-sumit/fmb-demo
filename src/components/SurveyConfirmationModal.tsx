import React from 'react';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <DialogTitle className="text-xl">Response Saved Successfully!</DialogTitle>
          <DialogDescription className="space-y-2">
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
          <Button onClick={onDownloadPDF} variant="outline" className="w-full">
            <Download size={16} className="mr-2" />
            Download Response PDF
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={onFillAnother} variant="outline">
              <RefreshCw size={16} className="mr-2" />
              Fill Another
            </Button>
            <Button onClick={onMySurveys}>
              My Surveys
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurveyConfirmationModal;