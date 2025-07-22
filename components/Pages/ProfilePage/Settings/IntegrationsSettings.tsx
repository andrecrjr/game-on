'use client';

import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Link,
  Plus,
  Trophy,
  Unlink,
} from 'lucide-react';
import React from 'react';
import {
  connectRetroAchievementsAccount,
  disconnectRetroAchievementsAccount,
  testRetroAchievementsConnection,
} from '@/app/services/retroAchievements';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface IntegrationsSettingsProps {
  session: any;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  isConnected: boolean;
  username?: string;
  apiKey?: string;
}

export const IntegrationsSettings: React.FC<IntegrationsSettingsProps> = ({
  session,
}) => {
  const [integrations, setIntegrations] = React.useState<Integration[]>([
    {
      id: 'retroachievements',
      name: 'RetroAchievements',
      description:
        'Connect your RetroAchievements account to sync achievements and game library',
      icon: Trophy,
      color: 'text-gaming-purple',
      isConnected: false,
    },
    {
      id: 'microsoft',
      name: 'Microsoft/Xbox Live',
      description:
        'Connect your Microsoft account to sync Xbox Live achievements and game library',
      icon: ExternalLink,
      color: 'text-green-500',
      isConnected: false,
    },
    // Future integrations can be added here
    // {
    //   id: 'psn',
    //   name: 'PlayStation Network',
    //   description: 'Connect your PSN account to sync trophies and games',
    //   icon: Gamepad2,
    //   color: 'text-blue-500',
    //   isConnected: false,
    // },
  ]);

  const [editingIntegration, setEditingIntegration] = React.useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [connectionStatus, setConnectionStatus] = React.useState<
    'idle' | 'testing' | 'success' | 'error'
  >('idle');

  const handleConnect = async (
    integrationId: string,
    username: string,
    apiKey?: string,
  ) => {
    setIsLoading(true);
    setConnectionStatus('testing');

    try {
      let success = false;

      if (integrationId === 'microsoft') {
        // Redirect to Microsoft OAuth
        window.location.href = '/api/link/microsoft';
        return;
      } else {
        // Handle other integrations (like RetroAchievements)
        if (!username.trim()) {
          setConnectionStatus('error');
          return;
        }

        const response = await fetch('/api/settings/integrations', {
          method: 'POST',
          body: JSON.stringify({ integrationId, username, apiKey }),
        });

        if (response.ok) {
          success = true;
        } else {
          success = false;
        }
      }

      if (success) {
        setIntegrations((prev) =>
          prev.map((integration) =>
            integration.id === integrationId
              ? { ...integration, isConnected: true, username }
              : integration,
          ),
        );
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      if (integrationId === 'retroachievements') {
        await disconnectRetroAchievementsAccount(
          integrations.find((i) => i.id === integrationId)?.username || '',
        );
      } else if (integrationId === 'microsoft') {
        // TODO: Implement Microsoft disconnect
        console.log('Microsoft disconnect not implemented yet');
      }
      // Add more integrations here as needed

      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === integrationId
            ? {
                ...integration,
                isConnected: false,
                username: undefined,
              }
            : integration,
        ),
      );
      setConnectionStatus('idle');
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const getIntegrationUrl = (integrationId: string) => {
    switch (integrationId) {
      case 'retroachievements':
        return 'https://retroachievements.org';
      case 'microsoft':
        return 'https://xbox.com';
      // Add more integrations here as needed
      default:
        return '#';
    }
  };

  return (
    <div className="space-y-6">
      {/* Available Integrations */}
      <div className="space-y-4">
        {integrations.map((integration: Integration) => {
          const Icon = integration.icon;
          const isEditing = editingIntegration === integration.id;
          const [username, setUsername] = React.useState(
            integration.username || '',
          );

          return (
            <Card
              key={integration.id}
              className={`border-2 ${
                integration.isConnected
                  ? 'border-gaming-accent bg-gaming-accent/5'
                  : 'border-gaming-purple/20'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${integration.color}`} />
                    <div>
                      <CardTitle className="text-lg">
                        {integration.name}
                      </CardTitle>
                      <p className="text-sm text-gaming-text-secondary">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.isConnected ? (
                      <div className="flex items-center gap-2 text-gaming-accent">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gaming-text-secondary">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Not Connected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!integration.isConnected ? (
                    <>
                      {integration.id === 'microsoft' ? (
                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              handleConnect(integration.id, '')
                            }
                            disabled={isLoading}
                            className="flex items-center gap-2"
                          >
                            <Link className="w-4 h-4" />
                            {isLoading ? 'Connecting...' : 'Connect Microsoft Account'}
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`${integration.id}-username`}>
                                {integration.name} Username
                              </Label>
                              <Input
                                id={`${integration.id}-username`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={`Enter your ${integration.name} username`}
                                className="bg-gaming-background-secondary w-full"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                handleConnect(integration.id, username)
                              }
                              disabled={isLoading || !username.trim()}
                              className="flex items-center gap-2"
                            >
                              <Link className="w-4 h-4" />
                              {isLoading ? 'Connecting...' : 'Connect Account'}
                            </Button>                        
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleDisconnect(integration.id)}
                        className="flex items-center gap-2"
                      >
                        <Unlink className="w-4 h-4" />
                        Disconnect
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          window.open(
                            getIntegrationUrl(integration.id),
                            '_blank',
                          )
                        }
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit {integration.name}
                      </Button>
                    </div>
                  )}

                  {/* Connection Status Indicator */}
                  {connectionStatus !== 'idle' &&
                    editingIntegration === integration.id && (
                      <div
                        className={`flex items-center gap-2 p-3 rounded-md ${
                          connectionStatus === 'success'
                            ? 'bg-gaming-accent/10 text-gaming-accent border border-gaming-accent/20'
                            : connectionStatus === 'error'
                              ? 'bg-destructive/10 text-destructive border border-destructive/20'
                              : 'bg-gaming-purple/10 text-gaming-purple border border-gaming-purple/20'
                        }`}
                      >
                        {connectionStatus === 'testing' && (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        )}
                        {connectionStatus === 'success' && (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        {connectionStatus === 'error' && (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        <span className="text-sm">
                          {connectionStatus === 'testing' &&
                            'Testing connection...'}
                          {connectionStatus === 'success' &&
                            'Connection successful!'}
                          {connectionStatus === 'error' &&
                            'Connection failed. Please check your credentials.'}
                        </span>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Button onClick={() => {
          window.location.href = '/api/link/microsoft';
        }}>
          Connect Microsoft Account
        </Button>
      </div>

      {/* Help Section */}
      <Card className="border-gaming-purple/20">
        <CardHeader>
          <CardTitle className="text-lg">About Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gaming-text-secondary">
            <p>
              <strong>What are integrations?</strong> Connect your accounts from
              other gaming platforms to sync achievements, game libraries, and
              more into your Steam profile.
            </p>
            <p>
              <strong>How to get started:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Choose the platform you want to connect</li>
              <li>Enter your username from that platform</li>
              <li>Optional: Add your API key for enhanced features</li>
              <li>Click "Connect Account" to establish the connection</li>
            </ol>
            <p>
              <strong>API Keys:</strong> Some platforms offer API keys for
              enhanced features like real-time sync and detailed statistics.
              These are optional but recommended for the best experience.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
