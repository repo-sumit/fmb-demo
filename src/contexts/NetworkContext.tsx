
import React, { createContext, useContext, useState } from 'react';

interface NetworkContextType {
  isOnline: boolean;
  toggleNetwork: () => void;
  downloadedSurveys: Set<string>;
  addDownloadedSurvey: (surveyId: string) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [downloadedSurveys, setDownloadedSurveys] = useState<Set<string>>(new Set());

  const toggleNetwork = () => {
    setIsOnline(!isOnline);
  };

  const addDownloadedSurvey = (surveyId: string) => {
    setDownloadedSurveys(prev => new Set([...prev, surveyId]));
  };

  return (
    <NetworkContext.Provider value={{
      isOnline,
      toggleNetwork,
      downloadedSurveys,
      addDownloadedSurvey
    }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
