
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface NetworkStatusProps {
  isOnline: boolean;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ isOnline }) => {
  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
      ${isOnline 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
      }
    `}>
      {isOnline ? (
        <Wifi size={12} />
      ) : (
        <WifiOff size={12} />
      )}
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
};

export default NetworkStatus;
