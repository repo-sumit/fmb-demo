import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Languages, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LanguageSelectionProps {
  survey: {
    id: string;
    name: string;
    description: string;
    languages: string[];
  };
  onLanguageSelect: (language: string) => void;
  onBack: () => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({
  survey,
  onLanguageSelect,
  onBack
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const handleContinue = () => {
    if (!selectedLanguage) {
      toast({
        title: "Language Required",
        description: "Please select a language to continue.",
        variant: "destructive"
      });
      return;
    }

    // Store selected language for the survey session
    localStorage.setItem(`survey_${survey.id}_language`, selectedLanguage);
    onLanguageSelect(selectedLanguage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 pb-20 pt-4 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">Language Selection</h1>
          <p className="text-sm text-muted-foreground">Choose your preferred language</p>
        </div>
      </div>

      {/* Survey Info Card */}
      <Card className="mb-8 border-white/20 shadow-lg backdrop-blur-sm bg-white/90">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg mb-1">{survey.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{survey.description}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Language Options */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">
          Available Languages ({survey.languages.length})
        </h2>
        
        <div className="grid gap-3">
          {survey.languages.map((language) => (
            <Card 
              key={language}
              className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-md ${
                selectedLanguage === language
                  ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                  : 'border-border hover:border-primary/50 bg-white/90'
              }`}
              onClick={() => setSelectedLanguage(language)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      selectedLanguage === language
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {selectedLanguage === language && (
                        <Check className="w-3 h-3 text-white m-0.5" />
                      )}
                    </div>
                    <span className="font-medium text-foreground">{language}</span>
                  </div>
                  
                  {selectedLanguage === language && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Selected
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Continue Button - Fixed to bottom with safe area and keyboard handling */}
      <div className="fixed bottom-4 left-4 right-4 z-50 pb-safe">
        <Button 
          onClick={handleContinue}
          disabled={!selectedLanguage}
          className="w-full h-12 text-base font-medium bg-gradient-primary hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          Continue with {selectedLanguage || 'Selected Language'}
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelection;