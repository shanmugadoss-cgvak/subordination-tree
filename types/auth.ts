import { PublicUser } from './user';

export interface AuthRequest {
  passphrase: string;
}

export interface AuthResponse {
  userId: string;
  parentUserId: string;
  createdAt: string;
  updatedAt: string;
  isTemporary: number;
}