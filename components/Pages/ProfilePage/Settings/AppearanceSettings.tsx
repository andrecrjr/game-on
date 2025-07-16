'use client';

import { Monitor, Moon, Palette, Sun, Zap } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AppearanceSettingsProps {
  session: any;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  session,
}) => {
  const [theme, setTheme] = React.useState('dark');
  const [accentColor, setAccentColor] = React.useState('purple');
  const [animations, setAnimations] = React.useState(true);
  const [compactMode, setCompactMode] = React.useState(false);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'auto', label: 'Auto', icon: Monitor },
  ];

  const accentColors = [
    { value: 'purple', name: 'Purple', class: 'bg-purple-500' },
    { value: 'cyan', name: 'Cyan', class: 'bg-cyan-500' },
    { value: 'green', name: 'Green', class: 'bg-green-500' },
    { value: 'pink', name: 'Pink', class: 'bg-pink-500' },
    { value: 'orange', name: 'Orange', class: 'bg-orange-500' },
    { value: 'blue', name: 'Blue', class: 'bg-blue-500' },
  ];

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // TODO: Implement theme change logic
  };

  const handleAccentChange = (newAccent: string) => {
    setAccentColor(newAccent);
    // TODO: Implement accent color change logic
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card className="border-gaming-purple/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-gaming-purple" />
            Theme & Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Theme Options */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gaming-text-primary">Theme</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      variant={theme === option.value ? 'default' : 'outline'}
                      onClick={() => handleThemeChange(option.value)}
                      className="flex items-center gap-2 h-auto p-4"
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gaming-text-primary">
                Accent Color
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {accentColors.map((color) => (
                  <Button
                    key={color.value}
                    variant={
                      accentColor === color.value ? 'default' : 'outline'
                    }
                    onClick={() => handleAccentChange(color.value)}
                    className="flex items-center gap-2 h-auto p-3"
                  >
                    <div className={`w-4 h-4 rounded-full ${color.class}`} />
                    {color.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gaming-background-secondary rounded-gaming-lg">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-gaming-purple" />
                  <div>
                    <h4 className="font-semibold text-gaming-text-primary">
                      Animations
                    </h4>
                    <p className="text-sm text-gaming-text-secondary">
                      Enable smooth animations and transitions
                    </p>
                  </div>
                </div>
                <Button
                  variant={animations ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAnimations(!animations)}
                >
                  {animations ? 'Enabled' : 'Disabled'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gaming-background-secondary rounded-gaming-lg">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-gaming-purple" />
                  <div>
                    <h4 className="font-semibold text-gaming-text-primary">
                      Compact Mode
                    </h4>
                    <p className="text-sm text-gaming-text-secondary">
                      Reduce spacing for more content
                    </p>
                  </div>
                </div>
                <Button
                  variant={compactMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCompactMode(!compactMode)}
                >
                  {compactMode ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="border-gaming-purple/20">
        <CardHeader>
          <CardTitle className="text-lg">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-gaming-background-secondary rounded-gaming-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gaming-purple rounded-full flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div>
                  <h4 className="font-semibold text-gaming-text-primary">
                    User Profile
                  </h4>
                  <p className="text-sm text-gaming-text-secondary">
                    Preview of your profile appearance
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gaming-background-tertiary rounded-md">
                  <div className="text-sm font-medium text-gaming-text-primary">
                    Games Owned
                  </div>
                  <div className="text-2xl font-bold text-gaming-purple">
                    127
                  </div>
                </div>
                <div className="p-3 bg-gaming-background-tertiary rounded-md">
                  <div className="text-sm font-medium text-gaming-text-primary">
                    Achievements
                  </div>
                  <div className="text-2xl font-bold text-gaming-cyan">
                    1,234
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-2 bg-gaming-background-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gaming-purple rounded-full transition-all duration-300"
                    style={{ width: '65%' }}
                  />
                </div>
                <p className="text-xs text-gaming-text-secondary">
                  Achievement Progress: 65%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customization Tips */}
      <Card className="border-gaming-purple/20">
        <CardHeader>
          <CardTitle className="text-lg">Customization Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gaming-text-secondary">
            <p>
              <strong>Theme:</strong> Choose between light, dark, or automatic
              themes. Automatic theme follows your system preferences.
            </p>
            <p>
              <strong>Accent Color:</strong> Personalize the interface with your
              preferred color scheme. This affects buttons, links, and
              highlights throughout the platform.
            </p>
            <p>
              <strong>Animations:</strong> Enable smooth transitions for a more
              polished experience, or disable them for better performance on
              slower devices.
            </p>
            <p>
              <strong>Compact Mode:</strong> Reduce spacing and padding to fit
              more content on screen, perfect for smaller displays or when you
              want to see more information at once.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
