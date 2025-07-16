'use client';

import { Edit, Save, X } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileSettingsProps {
  session: any;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  session,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [displayName, setDisplayName] = React.useState(
    session?.user?.name || '',
  );
  const [bio, setBio] = React.useState(
    'Gaming enthusiast and achievement hunter',
  );

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDisplayName(session?.user?.name || '');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gaming-background-secondary to-gaming-background-tertiary rounded-gaming-lg">
        <Avatar className="w-16 h-16 border-2 border-gaming-purple">
          <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
          <AvatarFallback className="bg-gaming-purple text-white text-lg">
            {session?.user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gaming-text-primary">
            {session?.user?.name || 'User'}
          </h3>
          <p className="text-gaming-text-secondary">
            Steam ID: {session?.user?.steam?.steamid || 'N/A'}
          </p>
        </div>
      </div>

      {/* Profile Information */}
      <Card className="border-gaming-purple/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Profile Information</CardTitle>
            <Button
              variant={isEditing ? 'outline' : 'default'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              {isEditing ? (
                <X className="w-4 h-4" />
              ) : (
                <Edit className="w-4 h-4" />
              )}
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={!isEditing}
                className="bg-gaming-background-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="steamId">Steam ID</Label>
              <Input
                id="steamId"
                value={session?.user?.steam?.steamid || 'N/A'}
                disabled
                className="bg-gaming-background-secondary opacity-60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing}
              className="w-full h-24 p-3 rounded-md border border-input bg-gaming-background-secondary text-foreground resize-none disabled:opacity-60"
              placeholder="Tell us about yourself..."
            />
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="border-gaming-purple/20">
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gaming-text-secondary">
            <div className="flex justify-between">
              <span>Steam ID:</span>
              <span className="font-mono">{session?.user?.steam?.steamid || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Account Created:</span>
              <span>{session?.user?.steam?.timecreated ? new Date(session.user.steam.timecreated * 1000).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Profile Visibility:</span>
              <span className="capitalize">{session?.user?.steam?.communityvisibilitystate === 3 ? 'Public' : 'Private'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
