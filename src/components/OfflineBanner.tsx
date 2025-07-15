import React from 'react';
import { WifiOff } from 'lucide-react';

const OfflineBanner: React.FC = () => {
  return (
    <div className="bg-orange-100 border-l-4 border-orange-500 p-3 mb-4">
      <div className="flex items-center">
        <WifiOff className="h-5 w-5 text-orange-600 mr-2" />
        <p className="text-sm font-medium text-orange-800">
          Offline Mode: Some actions unavailable
        </p>
      </div>
    </div>
  );
};

export default OfflineBanner;