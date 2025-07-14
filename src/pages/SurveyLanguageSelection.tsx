import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LanguageSelection from '@/components/LanguageSelection';

// Mock survey data - matches the data in MySurvey.tsx
const mockSurveys = [
  {
    id: 'SCH_2025_001',
    name: 'Annual School Infrastructure Audit',
    description: 'Comprehensive assessment of school buildings, classrooms, toilets, drinking water, and playground facilities',
    languages: ['Hindi', 'English']
  },
  {
    id: 'EDU_2025_002',
    name: 'Teacher Training Program Evaluation',
    description: 'Assessment of ongoing teacher professional development initiatives and their impact on classroom teaching',
    languages: ['Hindi', 'Gujarati']
  },
  {
    id: 'SCH_2025_003',
    name: 'Mid-Day Meal Quality Assessment',
    description: 'Evaluation of nutritional quality, hygiene standards, and student satisfaction with school meal programs',
    languages: ['English']
  },
  {
    id: 'SCH_2025_004',
    name: 'Digital Learning Infrastructure Survey',
    description: 'Assessment of computer labs, internet connectivity, smart classrooms, and digital learning resources',
    languages: ['Hindi', 'English']
  },
  {
    id: 'SCH_2025_005',
    name: 'School Safety and Security Audit',
    description: 'Comprehensive evaluation of emergency protocols, fire safety measures, boundary walls, and security arrangements',
    languages: ['Hindi', 'English']
  },
  {
    id: 'SCH_2025_006',
    name: 'Library and Learning Resources Assessment',
    description: 'Evaluation of library facilities, textbook availability, reference materials, and reading programs',
    languages: ['English', 'Gujarati']
  },
  {
    id: 'EDU_2025_007',
    name: 'Student Performance Analytics',
    description: 'Analysis of academic achievements, extracurricular participation, and overall student development metrics',
    languages: ['Hindi', 'English']
  },
  {
    id: 'EDU_2025_008',
    name: 'Parent-Teacher Interaction Assessment',
    description: 'Evaluation of parent engagement levels, PTA activities, and communication effectiveness between school and families',
    languages: ['Hindi', 'English', 'Gujarati']
  },
  {
    id: 'SCH_2025_009',
    name: 'Sanitation and Hygiene Monitoring',
    description: 'Assessment of toilet facilities, hand-washing stations, cleanliness standards, and health protocols',
    languages: ['Hindi', 'English']
  },
  {
    id: 'SCH_2025_010',
    name: 'Sports and Physical Education Audit',
    description: 'Evaluation of playground equipment, sports facilities, physical education programs, and student fitness levels',
    languages: ['English']
  }
];

const SurveyLanguageSelection: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();

  // Find the survey by ID
  const survey = mockSurveys.find(s => s.id === surveyId);

  if (!survey) {
    // If survey not found, redirect back to home
    navigate('/', { replace: true });
    return null;
  }

  const handleLanguageSelect = (language: string) => {
    // Navigate to the actual survey form with the selected language
    navigate(`/survey/${surveyId}?language=${encodeURIComponent(language)}`);
  };

  const handleBack = () => {
    // Go back to the survey list
    navigate('/', { replace: true });
  };

  return (
    <LanguageSelection 
      survey={survey}
      onLanguageSelect={handleLanguageSelect}
      onBack={handleBack}
    />
  );
};

export default SurveyLanguageSelection;