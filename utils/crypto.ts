import crypto from 'crypto';

export function hashPassphrase(passphrase: string): string {
  return crypto
    .createHash('sha256')
    .update(passphrase)
    .digest('hex');
}