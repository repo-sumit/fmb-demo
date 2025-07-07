
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import ProfileModal from './ProfileModal';

const ProfileButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsModalOpen(true)}
        className="fixed top-4 right-4 z-40 w-10 h-10 bg-primary/10 hover:bg-primary/20"
      >
        <User size={18} className="text-primary" />
      </Button>

      <ProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ProfileButton;
