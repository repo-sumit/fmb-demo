
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Wifi, WifiOff } from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';

const NetworkToggle: React.FC = () => {
  const { isOnline, toggleNetwork } = useNetwork();

  return (
    <div className="flex items-center space-x-2 glass-card rounded-full px-3 py-2 shadow-lg hover-glow border border-purple-300/20">
      {isOnline ? (
        <Wifi size={14} className="text-green-400 pulse-slow" />
      ) : (
        <WifiOff size={14} className="text-red-400 pulse-slow" />
      )}
      <Label htmlFor="network-toggle" className="text-xs font-medium cursor-pointer gradient-text">
        {isOnline ? 'Online' : 'Offline'}
      </Label>
      <Switch
        id="network-toggle"
        checked={isOnline}
        onCheckedChange={toggleNetwork}
        className="scale-75 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-600"
      />
    </div>
  );
};

export default NetworkToggle;
