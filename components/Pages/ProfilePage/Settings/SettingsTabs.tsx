'use client';

import { Link, Palette, Settings, Shield, User } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppearanceSettings } from './AppearanceSettings';
import { IntegrationsSettings } from './IntegrationsSettings';
import { PrivacySettings } from './PrivacySettings';
import { ProfileSettings } from './ProfileSettings';

interface SettingsTabsProps {
  session: any;
}

const tabs = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    component: ProfileSettings,
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: Link,
    component: IntegrationsSettings,
  },
  // {
  //   id: 'privacy',
  //   label: 'Privacy',
  //   icon: Shield,
  //   component: PrivacySettings,
  // },
  // {
  //   id: 'appearance',
  //   label: 'Appearance',
  //   icon: Palette,
  //   component: AppearanceSettings,
  // },
];

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || ProfileSettings;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 transition-all duration-200"
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <Card className="shadow-gaming border-gaming-purple/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {tabs.find((tab) => tab.id === activeTab)?.label} Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActiveComponent session={session} />
        </CardContent>
      </Card>
    </div>
  );
};
