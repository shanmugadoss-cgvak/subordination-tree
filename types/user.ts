export interface User {
  userId: string;
  createdAt: string;
  updatedAt: string;
  passphrase: string;
  parentUserId: string; // Remove optional since we default to "null"
  isTemporary: number;
}

export interface CreateUserRequest {
  passphrase: string;
  parentUserId?: string;
  isTemporary?: boolean;
}

export interface PublicUser {
  userId: string;
  parentUserId: string;
  createdAt: string;
  updatedAt: string;
  isTemporary: number; // Added to match DynamoDB schema
}

export interface EnhancedPublicUser extends PublicUser {
  children?: EnhancedPublicUser[];
  directChildrenCount: number;
  totalDescendantsCount: number;
}

export interface UpdatePassphraseRequest {
  userId: string;
  oldPassphrase: string;
  newPassphrase: string;
}