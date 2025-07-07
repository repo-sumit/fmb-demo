
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { User, LogOut, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    userId: 'ANT_123',
    name: 'Anita Sharma',
    gender: 'Female',
    state: 'Gujarat',
    district: 'Ahmedabad',
    designation: 'Teacher'
  });

  const handleSave = () => {
    // Simulate API save
    setTimeout(() => {
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully!",
      });
    }, 500);
  };

  const handleLogout = () => {
    // In real app, clear auth tokens and redirect
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/login');
  };

  return (
    <div className="pb-20 pt-4 px-4 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="display-l">Profile</h1>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <User size={20} className="text-primary" />
        </div>
      </div>

      {/* Profile Form */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={profile.userId}
              disabled
              className="bg-muted"
            />
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={profile.gender}
              onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Select
              value={profile.state}
              onValueChange={(value) => setProfile(prev => ({ ...prev, state: value }))}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gujarat">Gujarat</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              value={profile.district}
              onChange={(e) => setProfile(prev => ({ ...prev, district: e.target.value }))}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="designation">Designation</Label>
            <Input
              id="designation"
              value={profile.designation}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isEditing ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full"
            >
              Edit Profile
            </Button>
          )}
        </div>

        <Separator />

        {/* Logout Button */}
        <div className="space-y-3">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full justify-start h-14 text-lg font-semibold"
            size="lg"
          >
            <LogOut size={24} className="mr-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
