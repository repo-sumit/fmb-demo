
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, School, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNetwork } from '@/contexts/NetworkContext';
import { schoolCacheUtils } from '@/utils/schoolCache';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const UdiseValidation: React.FC = () => {
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const { isOnline } = useNetwork();
  const [udiseCode, setUdiseCode] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);

  // Mock school data for validation
  const mockSchoolData = {
    '12345678901': {
      name: 'Government Primary School, Ahmedabad',
      udise: '12345678901',
      district: 'Ahmedabad',
      state: 'Gujarat'
    },
    '23456789012': {
      name: 'Sarva Shiksha Abhiyan School',
      udise: '23456789012',
      district: 'Surat',
      state: 'Gujarat'
    },
    '34567890123': {
      name: 'Municipal Corporation School',
      udise: '34567890123',
      district: 'Vadodara',
      state: 'Gujarat'
    }
  };

  const handleValidate = () => {
    // Validate 11-digit numeric code
    if (!/^\d{11}$/.test(udiseCode)) {
      toast({
        title: "Invalid UDISE Code",
        description: "Please enter a valid 11-digit numeric UDISE code",
        variant: "destructive"
      });
      return;
    }

    // If offline, check local cache first
    if (!isOnline) {
      const cachedSchool = schoolCacheUtils.findCachedSchool(udiseCode);
      if (cachedSchool) {
        setSchoolInfo({
          name: cachedSchool.name,
          udise: cachedSchool.udise,
          district: cachedSchool.district || 'Unknown',
          state: 'Gujarat' // Default state
        });
        setIsValidated(true);
        toast({
          title: "School Found (Cached)",
          description: "School information loaded from offline cache",
        });
        return;
      } else {
        setShowOfflineDialog(true);
        return;
      }
    }

    // Online validation - check mock data first, then cached data as fallback
    let schoolData = mockSchoolData[udiseCode as keyof typeof mockSchoolData];
    
    if (!schoolData) {
      const cachedSchool = schoolCacheUtils.findCachedSchool(udiseCode);
      if (cachedSchool) {
        schoolData = {
          name: cachedSchool.name,
          udise: cachedSchool.udise,
          district: cachedSchool.district || 'Unknown',
          state: 'Gujarat'
        };
      }
    }
    
    if (schoolData) {
      setSchoolInfo(schoolData);
      setIsValidated(true);
      toast({
        title: "UDISE Code Validated",
        description: "School information verified successfully",
      });
    } else {
      toast({
        title: "School Not Found",
        description: "No school found with this UDISE code. Please check and try again.",
        variant: "destructive"
      });
    }
  };

  const handleProceed = () => {
    if (isValidated && schoolInfo) {
      // Store school info and proceed to language selection
      localStorage.setItem(`school_${surveyId}`, JSON.stringify(schoolInfo));
      navigate(`/survey-language/${surveyId}`);
    }
  };

  return (
    <div className="pb-20 pt-4 px-4 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="display-l">School Verification</h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* UDISE Input Card */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <School size={48} className="mx-auto mb-4 text-primary" />
                <h2 className="text-lg font-semibold mb-2">Enter School UDISE Code</h2>
                <p className="text-sm text-muted-foreground">
                  Please enter the 11-digit UDISE code of your school to proceed with the survey.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="udise">UDISE Code *</Label>
                <Input
                  id="udise"
                  value={udiseCode}
                  onChange={(e) => setUdiseCode(e.target.value)}
                  placeholder="Enter 11-digit UDISE code"
                  maxLength={11}
                  disabled={isValidated}
                />
              </div>

              {!isValidated && (
                <Button 
                  onClick={handleValidate}
                  className="w-full"
                  disabled={udiseCode.length !== 11}
                >
                  Validate UDISE Code
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Validation Result */}
        {isValidated && schoolInfo && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={20} />
                  <span className="font-semibold">School Verified</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">School Name</Label>
                    <p className="font-medium">{schoolInfo.name}</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">UDISE Code</Label>
                    <p className="font-medium">{schoolInfo.udise}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">District</Label>
                      <p className="font-medium">{schoolInfo.district}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">State</Label>
                      <p className="font-medium">{schoolInfo.state}</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleProceed} className="w-full">
                  Proceed to Survey
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Need help finding your UDISE code?</p>
          <p>Contact your school administration or district education office.</p>
        </div>
      </div>

      {/* Offline Dialog */}
      <Dialog open={showOfflineDialog} onOpenChange={setShowOfflineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-600" />
              School Not Found
            </DialogTitle>
            <DialogDescription>
              The entered UDISE code was not found in your offline cache. 
              Please connect to the network to validate or select another UDISE code.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2">
            <Button onClick={() => setShowOfflineDialog(false)} className="w-full">
              Enter Different UDISE
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Go Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UdiseValidation;
