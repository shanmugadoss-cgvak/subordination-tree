import { CreateUserRequest } from "@/types/user";

export function validateUser(data: CreateUserRequest): string[] {
  const errors: string[] = [];

  if (!data.passphrase) {
    errors.push("Passphrase is required");
  }

  if (data.passphrase && data.passphrase.length < 3) {
    errors.push("Passphrase must be at least 3 characters");
  }

  // Add additional validation as needed

  return errors;
}