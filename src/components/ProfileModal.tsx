
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const profile = {
    userId: 'ANT_123',
    name: 'Anita Sharma',
    designation: 'Teacher'
  };

  const handleLogout = () => {
    onClose();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-medium">{profile.userId}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{profile.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Designation</p>
              <p className="font-medium">{profile.designation}</p>
            </div>
          </div>

          <Separator />

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
