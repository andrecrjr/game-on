export interface IPocketBaseUser {
  id: string;
  email: string;
  username: string;
  name?: string;
  emailVerified?: Date | null;
  pocketbaseToken: string;
  pocketbaseRecord: any;
}

export interface IPocketBaseAccount {
  provider: 'pocketbase';
  type: 'credentials';
  providerAccountId: string;
  access_token: string;
}