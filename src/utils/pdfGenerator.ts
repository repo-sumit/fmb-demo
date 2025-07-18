import { toast } from '@/hooks/use-toast';

interface SurveyResponse {
  surveyId: string;
  surveyName: string;
  udiseCode?: string;
  schoolName?: string;
  responses: Record<string, any>;
  completedAt: string;
  submittedBy?: string;
}

export const generateResponsePDF = async (response: SurveyResponse): Promise<void> => {
  try {
    // For now, we'll simulate PDF generation and create a downloadable blob
    // In a real implementation, you would use a library like jsPDF or PDFKit
    
    const pdfContent = generatePDFContent(response);
    
    // Create a blob with the PDF content (simulated as text for now)
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Survey_Response_${response.surveyId}_${new Date().toISOString().split('T')[0]}.txt`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    toast({
      title: "PDF Downloaded",
      description: "Survey response has been downloaded successfully.",
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast({
      title: "Download Failed",
      description: "Failed to generate PDF. Please try again.",
      variant: "destructive"
    });
  }
};

const generatePDFContent = (response: SurveyResponse): string => {
  const { surveyName, surveyId, udiseCode, schoolName, responses, completedAt, submittedBy } = response;
  
  let content = `
SURVEY RESPONSE REPORT
====================

Survey Information:
------------------
Survey Name: ${surveyName}
Survey ID: ${surveyId}
Completed Date: ${new Date(completedAt).toLocaleString()}
${submittedBy ? `Submitted By: ${submittedBy}` : ''}

${udiseCode || schoolName ? `
School Information:
------------------
${schoolName ? `School Name: ${schoolName}` : ''}
${udiseCode ? `UDISE Code: ${udiseCode}` : ''}
` : ''}

Survey Responses:
----------------
`;

  // Add responses
  Object.entries(responses).forEach(([questionId, answer]) => {
    content += `
${questionId}: `;
    
    if (Array.isArray(answer)) {
      content += `
  - ${answer.join('\n  - ')}`;
    } else if (typeof answer === 'object' && answer !== null) {
      content += `
  ${JSON.stringify(answer, null, 2)}`;
    } else {
      content += `${answer}`;
    }
    
    content += '\n';
  });

  content += `

------------------
Generated on: ${new Date().toLocaleString()}
This is a system-generated document.
`;

  return content;
};

// Utility to check if device supports PDF generation
export const isPDFGenerationSupported = (): boolean => {
  return typeof window !== 'undefined' && typeof Blob !== 'undefined';
};

// Save PDF locally for offline mode
export const savePDFLocally = async (response: SurveyResponse): Promise<boolean> => {
  try {
    const pdfContent = generatePDFContent(response);
    const key = `pdf_${response.surveyId}_${Date.now()}`;
    
    localStorage.setItem(key, JSON.stringify({
      content: pdfContent,
      metadata: {
        surveyId: response.surveyId,
        surveyName: response.surveyName,
        createdAt: new Date().toISOString(),
        size: pdfContent.length
      }
    }));
    
    return true;
  } catch (error) {
    console.error('Error saving PDF locally:', error);
    return false;
  }
};

// Get locally saved PDFs
export const getLocalPDFs = (): Array<{ key: string; metadata: any }> => {
  const pdfs: Array<{ key: string; metadata: any }> = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('pdf_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '');
        pdfs.push({ key, metadata: data.metadata });
      } catch (error) {
        console.error('Error reading local PDF:', error);
      }
    }
  }
  
  return pdfs.sort((a, b) => 
    new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
  );
};