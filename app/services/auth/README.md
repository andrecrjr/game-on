# Authentication Service

This directory contains a modular authentication system for the Steam-on application.

## Structure

```
auth/
├── providers/           # Authentication provider configurations
│   ├── steamProvider.ts # Steam authentication provider
│   ├── azureProvider.ts # Azure AD authentication provider
│   └── index.ts        # Provider exports
├── callbacks/          # Authentication callback handlers
│   ├── steamCallbacks.ts # Steam-specific callbacks
│   └── index.ts        # Callback exports
├── authService.ts      # Centralized authentication service
├── index.ts           # Main exports
└── README.md          # This file
```

## Usage

### Basic Usage

```typescript
import { AuthService } from '@/app/services/auth';

// Get authentication options for NextAuth
const authOptions = AuthService.getAuthOptions(req);
```

### Adding a New Provider

1. Create a new provider file in `providers/`:
```typescript
// providers/newProvider.ts
export const getNewProvider = () => {
  return NewProvider({
    // configuration
  });
};
```

2. Add it to the providers index:
```typescript
// providers/index.ts
export { getNewProvider } from './newProvider';
```

3. Update the AuthService:
```typescript
// authService.ts
import { getNewProvider } from './providers';

static getProviders(req?: NextRequest) {
  return [
    getSteamProvider(req), 
    getAzureProvider(),
    getNewProvider() // Add here
  ];
}
```

### Adding Provider-Specific Callbacks

1. Create a callback file in `callbacks/`:
```typescript
// callbacks/newProviderCallbacks.ts
export const handleNewProviderJWT = (token, account, profile) => {
  // JWT handling logic
  return token;
};

export const handleNewProviderSession = async (session, token) => {
  // Session handling logic
  return session;
};
```

2. Add it to the callbacks index:
```typescript
// callbacks/index.ts
export { handleNewProviderJWT, handleNewProviderSession } from './newProviderCallbacks';
```

3. Update the AuthService to use the new callbacks:
```typescript
// authService.ts
import { handleNewProviderJWT, handleNewProviderSession } from './callbacks';

static handleJWT({ token, account, profile }) {
  // Handle existing providers...
  
  // Handle new provider
  if (account?.provider === 'new-provider' && profile) {
    return handleNewProviderJWT(token, account, profile);
  }
  
  return token;
}

static async handleSession({ session, token }) {
  // Handle existing providers...
  
  // Handle new provider
  if (token.newProvider) {
    return await handleNewProviderSession(session, token);
  }
  
  return session;
}
```

## Benefits

- **Modularity**: Each provider is isolated in its own file
- **Maintainability**: Easy to add, remove, or modify providers
- **Testability**: Individual components can be tested in isolation
- **Scalability**: New providers can be added without affecting existing ones
- **Type Safety**: Strong typing throughout the system

## Migration

The original `steamAuth.ts` file has been refactored to use this new structure while maintaining backward compatibility. Existing imports will continue to work. 