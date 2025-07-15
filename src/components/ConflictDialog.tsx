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
import { Calendar, School } from 'lucide-react';

interface ConflictDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAgain: () => void;
  onCancel: () => void;
  schoolName: string;
  udiseCode: string;
  previousSyncDate: string;
}

const ConflictDialog: React.FC<ConflictDialogProps> = ({
  isOpen,
  onClose,
  onSubmitAgain,
  onCancel,
  schoolName,
  udiseCode,
  previousSyncDate
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Duplicate Survey Response</DialogTitle>
          <DialogDescription>
            This survey has already been submitted from another device.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm">
            <School size={16} className="text-blue-600" />
            <span className="font-medium">School:</span>
            <span>{schoolName}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <School size={16} className="text-blue-600" />
            <span className="font-medium">UDISE:</span>
            <span>{udiseCode}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Calendar size={16} className="text-green-600" />
            <span className="font-medium">Previous sync:</span>
            <span>{previousSyncDate}</span>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              Would you like to submit this response as a separate entry?
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmitAgain}>
            Yes, Submit Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConflictDialog;