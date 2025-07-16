import AzureAD from 'next-auth/providers/azure-ad';

/**
 * Azure AD authentication provider configuration
 */
export const getAzureProvider = () => {
  return AzureAD({
    clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
    clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
    tenantId: 'consumers',
    authorization: {
      params: {
        scope: 'openid profile XboxLive.signin XboxLive.offline_access',
      },
    },
  });
};

/**
 * Azure provider constants
 */
export const AZURE_PROVIDER = {
  id: 'azure-ad',
  name: 'Microsoft',
} as const; 