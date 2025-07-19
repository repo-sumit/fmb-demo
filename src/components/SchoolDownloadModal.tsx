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
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, School, Plus, X, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface School {
  udise: string;
  name: string;
  address?: string;
  district?: string;
  block?: string;
}

interface SchoolDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinishAndDownload: (schools: School[]) => void;
  surveyName: string;
}

const SchoolDownloadModal: React.FC<SchoolDownloadModalProps> = ({
  isOpen,
  onClose,
  onFinishAndDownload,
  surveyName
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<School[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<School[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Mock school database for search
  const mockSchoolDatabase: School[] = [
    {
      udise: '12345678901',
      name: 'Government Primary School, Ahmedabad',
      address: 'Satellite Road, Ahmedabad',
      district: 'Ahmedabad',
      block: 'Ahmedabad East'
    },
    {
      udise: '22446688001',
      name: 'Sarva Shiksha Abhiyan School',
      address: 'Ring Road, Surat',
      district: 'Surat',
      block: 'Surat North'
    },
    {
      udise: '22446688002',
      name: 'Municipal Corporation School',
      address: 'Main Street, Vadodara',
      district: 'Vadodara',
      block: 'Vadodara West'
    },
    {
      udise: '22446688003',
      name: 'Kasturba Gandhi Balika Vidyalaya',
      address: 'Gandhi Nagar, Rajkot',
      district: 'Rajkot',
      block: 'Rajkot Rural'
    },
    {
      udise: '22446688004',
      name: 'Government Higher Secondary School',
      address: 'Station Road, Bhavnagar',
      district: 'Bhavnagar',
      block: 'Bhavnagar City'
    },
    {
      udise: '22446688005',
      name: 'Government Higher Secondary School',
      address: 'Station Road, Bhavnagar',
      district: 'Bhavnagar',
      block: 'Bhavnagar City'
    },
    {
      udise: '22446688006',
      name: 'Government Higher Secondary School',
      address: 'Station Road, Bhavnagar',
      district: 'Bhavnagar',
      block: 'Bhavnagar City'
    },
    {
      udise: '22446688007',
      name: 'Government Higher Secondary School',
      address: 'Station Road, Bhavnagar',
      district: 'Bhavnagar',
      block: 'Bhavnagar City'
    },
    {
      udise: '22446688008',
      name: 'Government Higher Secondary School',
      address: 'Station Road, Bhavnagar',
      district: 'Bhavnagar',
      block: 'Bhavnagar City'
    },
    {
      udise: '22446688009',
      name: 'Government Higher Secondary School',
      address: 'Station Road, Bhavnagar',
      district: 'Bhavnagar',
      block: 'Bhavnagar City'
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = mockSchoolDatabase.filter(school => 
        school.udise.includes(searchQuery) ||
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (school.address && school.address.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(results);
      setIsSearching(false);
      
      if (results.length === 0) {
        toast({
          title: "No Results",
          description: "No schools found matching your search criteria.",
        });
      }
    }, 500);
  };

  const handleAddSchool = (school: School) => {
    if (selectedSchools.find(s => s.udise === school.udise)) {
      toast({
        title: "Already Added",
        description: "This school is already in your list.",
        variant: "destructive"
      });
      return;
    }

    setSelectedSchools(prev => [...prev, school]);
    setSearchQuery('');
    setSearchResults([]);
    
    toast({
      title: "School Added",
      description: `${school.name} has been added to your offline list.`,
    });
  };

  const handleRemoveSchool = (udise: string) => {
    setSelectedSchools(prev => prev.filter(school => school.udise !== udise));
  };

  const handleFinishAndDownload = () => {
    if (selectedSchools.length === 0) {
      toast({
        title: "No Schools Selected",
        description: "Please add at least one school before proceeding.",
        variant: "destructive"
      });
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate download process with progress
    const downloadSteps = [
      { progress: 20, message: "Preparing survey data..." },
      { progress: 40, message: "Caching school information..." },
      { progress: 60, message: "Downloading survey forms..." },
      { progress: 80, message: "Optimizing for offline use..." },
      { progress: 100, message: "Download complete!" }
    ];

    let currentStep = 0;

    const progressInterval = setInterval(() => {
      if (currentStep < downloadSteps.length) {
        const step = downloadSteps[currentStep];
        setDownloadProgress(step.progress);
        
        toast({
          title: step.message,
          description: `${step.progress}% complete`,
        });

        if (step.progress === 100) {
          clearInterval(progressInterval);
          
          // Store schools in localStorage with timestamp
          const schoolData = {
            schools: selectedSchools,
            timestamp: Date.now(),
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
          };
          
          localStorage.setItem('cached_schools', JSON.stringify(schoolData));
          
          setTimeout(() => {
            setIsDownloading(false);
            onFinishAndDownload(selectedSchools);
            onClose();
          }, 1000);
        }
        currentStep++;
      }
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <School size={20} className="text-primary" />
            Add Schools for Offline Use
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            To conduct this survey offline at a later stage for specific schools, please add their school codes below. 
            You may add up to 20 schools.
          </DialogDescription>
        </DialogHeader>

        {/* Download Progress Bar */}
        {isDownloading && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Download size={16} className="text-primary animate-pulse" />
              <span className="text-sm font-medium">Downloading Survey...</span>
            </div>
            <Progress value={downloadProgress} className="w-full" />
            <p className="text-xs text-muted-foreground">{downloadProgress}% complete</p>
          </div>
        )}

        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search by UDISE code or school name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm sm:text-base"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isDownloading}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={!searchQuery.trim() || isSearching || isDownloading}
              className="w-full sm:w-auto"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && !isDownloading && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm sm:text-base">Search Results</h4>
              <div className="max-h-32 sm:max-h-40 overflow-y-auto space-y-2">
                {searchResults.map((school) => (
                  <Card key={school.udise} className="p-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm sm:text-base truncate">{school.name}</h5>
                        {school.address && (
                          <p className="text-xs text-muted-foreground truncate">{school.address}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            UDISE: {school.udise}
                          </Badge>
                          {school.district && (
                            <Badge variant="outline" className="text-xs">
                              {school.district}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleAddSchool(school)}
                          disabled={selectedSchools.find(s => s.udise === school.udise) !== undefined}
                          className="w-full sm:w-auto"
                        >
                          <Plus size={14} className="mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Selected Schools */}
          {selectedSchools.length > 0 && !isDownloading && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm sm:text-base">
                Selected Schools ({selectedSchools.length})
              </h4>
              <div className="max-h-32 sm:max-h-40 overflow-y-auto space-y-2">
                {selectedSchools.map((school) => (
                  <Card key={school.udise} className="p-3 bg-green-50 border-green-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm sm:text-base truncate">{school.name}</h5>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="outline" className="text-xs bg-white">
                            UDISE: {school.udise}
                          </Badge>
                          {school.district && (
                            <Badge variant="outline" className="text-xs bg-white">
                              {school.district}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveSchool(school.udise)}
                        className="self-end sm:self-start"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto" disabled={isDownloading}>
            Cancel
          </Button>
          <Button 
            onClick={handleFinishAndDownload}
            disabled={selectedSchools.length === 0 || isDownloading}
            className="w-full sm:w-auto"
          >
            {isDownloading ? 'Downloading...' : 'Finish & Download Survey'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SchoolDownloadModal;
