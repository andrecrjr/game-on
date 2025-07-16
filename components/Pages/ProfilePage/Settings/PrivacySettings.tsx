'use client';

import { Eye, EyeOff, Lock, Shield, Unlock } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PrivacySettingsProps {
  session: any;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  session,
}) => {
  const [settings, setSettings] = React.useState({
    profileVisibility: 'public',
    showGameLibrary: true,
    showAchievements: true,
    showPlayTime: true,
    allowDataCollection: false,
    showOnlineStatus: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card className="border-gaming-purple/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gaming-purple" />
            Profile Visibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gaming-background-secondary rounded-gaming-lg">
              <div className="flex items-center gap-3">
                {settings.profileVisibility === 'public' ? (
                  <Eye className="w-5 h-5 text-gaming-accent" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gaming-text-secondary" />
                )}
                <div>
                  <h4 className="font-semibold text-gaming-text-primary">
                    Profile Visibility
                  </h4>
                  <p className="text-sm text-gaming-text-secondary">
                    {settings.profileVisibility === 'public'
                      ? 'Your profile is visible to everyone'
                      : 'Your profile is private'}
                  </p>
                </div>
              </div>
              <select
                value={settings.profileVisibility}
                onChange={(e) =>
                  handleSettingChange('profileVisibility', e.target.value)
                }
                className="px-3 py-2 rounded-md border border-input bg-gaming-background-secondary text-foreground"
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gaming-background-secondary rounded-gaming-lg">
                <div className="flex items-center gap-3">
                  {settings.showGameLibrary ? (
                    <Unlock className="w-5 h-5 text-gaming-accent" />
                  ) : (
                    <Lock className="w-5 h-5 text-gaming-text-secondary" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gaming-text-primary">
                      Game Library
                    </h4>
                    <p className="text-sm text-gaming-text-secondary">
                      Show owned games
                    </p>
                  </div>
                </div>
                <Button
                  variant={settings.showGameLibrary ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    handleSettingChange(
                      'showGameLibrary',
                      !settings.showGameLibrary,
                    )
                  }
                >
                  {settings.showGameLibrary ? 'Visible' : 'Hidden'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gaming-background-secondary rounded-gaming-lg">
                <div className="flex items-center gap-3">
                  {settings.showAchievements ? (
                    <Unlock className="w-5 h-5 text-gaming-accent" />
                  ) : (
                    <Lock className="w-5 h-5 text-gaming-text-secondary" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gaming-text-primary">
                      Achievements
                    </h4>
                    <p className="text-sm text-gaming-text-secondary">
                      Show achievement progress
                    </p>
                  </div>
                </div>
                <Button
                  variant={settings.showAchievements ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    handleSettingChange(
                      'showAchievements',
                      !settings.showAchievements,
                    )
                  }
                >
                  {settings.showAchievements ? 'Visible' : 'Hidden'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gaming-background-secondary rounded-gaming-lg">
                <div className="flex items-center gap-3">
                  {settings.showPlayTime ? (
                    <Unlock className="w-5 h-5 text-gaming-accent" />
                  ) : (
                    <Lock className="w-5 h-5 text-gaming-text-secondary" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gaming-text-primary">
                      Play Time
                    </h4>
                    <p className="text-sm text-gaming-text-secondary">
                      Show hours played
                    </p>
                  </div>
                </div>
                <Button
                  variant={settings.showPlayTime ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    handleSettingChange('showPlayTime', !settings.showPlayTime)
                  }
                >
                  {settings.showPlayTime ? 'Visible' : 'Hidden'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gaming-background-secondary rounded-gaming-lg">
                <div className="flex items-center gap-3">
                  {settings.showOnlineStatus ? (
                    <Unlock className="w-5 h-5 text-gaming-accent" />
                  ) : (
                    <Lock className="w-5 h-5 text-gaming-text-secondary" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gaming-text-primary">
                      Online Status
                    </h4>
                    <p className="text-sm text-gaming-text-secondary">
                      Show when you're online
                    </p>
                  </div>
                </div>
                <Button
                  variant={settings.showOnlineStatus ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    handleSettingChange(
                      'showOnlineStatus',
                      !settings.showOnlineStatus,
                    )
                  }
                >
                  {settings.showOnlineStatus ? 'Visible' : 'Hidden'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Collection */}
      <Card className="border-gaming-purple/20">
        <CardHeader>
          <CardTitle className="text-lg">Data & Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gaming-background-secondary rounded-gaming-lg">
              <div className="flex items-center gap-3">
                {settings.allowDataCollection ? (
                  <Unlock className="w-5 h-5 text-gaming-accent" />
                ) : (
                  <Lock className="w-5 h-5 text-gaming-text-secondary" />
                )}
                <div>
                  <h4 className="font-semibold text-gaming-text-primary">
                    Analytics Data
                  </h4>
                  <p className="text-sm text-gaming-text-secondary">
                    Allow anonymous usage data to improve the platform
                  </p>
                </div>
              </div>
              <Button
                variant={settings.allowDataCollection ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  handleSettingChange(
                    'allowDataCollection',
                    !settings.allowDataCollection,
                  )
                }
              >
                {settings.allowDataCollection ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Information */}
      <Card className="border-gaming-purple/20">
        <CardHeader>
          <CardTitle className="text-lg">Privacy Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gaming-text-secondary">
            <p>
              <strong>Data Protection:</strong> We respect your privacy and only
              collect data necessary for the platform's functionality. Your
              Steam data is processed securely and never shared with third
              parties without your consent.
            </p>
            <p>
              <strong>Profile Visibility:</strong> Control who can see your
              gaming profile, achievements, and library. You can make your
              profile public, friends-only, or completely private.
            </p>
            <p>
              <strong>Data Retention:</strong> Your data is stored securely and
              you can request deletion at any time through your account
              settings.
            </p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm">
                Download My Data
              </Button>
              <Button variant="outline" size="sm">
                Request Deletion
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
