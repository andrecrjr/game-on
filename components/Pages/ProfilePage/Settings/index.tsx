import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/app/services/steamAuth';
import { SettingsTabs } from './SettingsTabs';

export default async function Settings() {
  const session = await getServerSession(getAuthOptions(undefined));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gaming-text-primary">
            Settings
          </h1>
          <p className="text-gaming-text-secondary">
            Configure your gaming profile and integrations
          </p>
        </div>
        
        <SettingsTabs session={session} />
      </div>
    </div>
  );
}