
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Wifi, WifiOff } from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';

const NetworkToggle: React.FC = () => {
  const { isOnline, toggleNetwork } = useNetwork();

  return (
    <div className="flex items-center space-x-2 bg-white rounded-full px-2 py-1 shadow-sm border">
      {isOnline ? (
        <Wifi size={14} className="text-green-600" />
      ) : (
        <WifiOff size={14} className="text-red-600" />
      )}
      <Label htmlFor="network-toggle" className="text-xs font-medium cursor-pointer">
        {isOnline ? 'Online' : 'Offline'}
      </Label>
      <Switch
        id="network-toggle"
        checked={isOnline}
        onCheckedChange={toggleNetwork}
        className="scale-75"
      />
    </div>
  );
};

export default NetworkToggle;
