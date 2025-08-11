import { NextRequest } from 'next/server';
import CredentialsProvider from 'next-auth/providers/credentials';
import PocketBase from 'pocketbase';
import { IPocketBaseUser } from '@/types/pocketbase';

/**
 * PocketBase authentication provider configuration
 */
export const getPocketBaseProvider = (req?: NextRequest) => {
  return CredentialsProvider({
    id: 'pocketbase',
    name: 'PocketBase',
    credentials: {
      email: { label: 'Email', type: 'text' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials, req) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      try {
        const pb = new PocketBase(process.env.POCKETBASE_URL);
        
        // Authenticate user with email and password
        const authData = await pb.collection('user_acjr').authWithPassword(
          credentials.email,
          credentials.password
        );

        if (authData?.token) {
          // Get user record
          const userRecord = await pb.collection('user_acjr').getOne(authData.record.id);
          
          // Return user object that will be passed to the JWT callback
          return {
            id: userRecord.id,
            email: userRecord.email,
            username: userRecord.username,
            name: userRecord.name || userRecord.username,
            emailVerified: userRecord.verified ? new Date() : null,
            pocketbaseToken: authData.token,
            pocketbaseRecord: userRecord
          } as IPocketBaseUser;
        }
        
        return null;
      } catch (error) {
        console.error('PocketBase authentication error:', error);
        return null;
      }
    }
  });
};

/**
 * PocketBase provider constants
 */
export const POCKETBASE_PROVIDER = {
  id: 'pocketbase',
  name: 'PocketBase',
} as const;