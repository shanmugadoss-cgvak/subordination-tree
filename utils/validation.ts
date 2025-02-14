export function validatePassphrase(passphrase: string): string[] {
  const errors: string[] = [];
  
  // Check minimum length
  if (passphrase.length < 20) {
    errors.push("Passphrase must be at least 20 characters long");
  }

  // Check for capital letter
  if (!/[A-Z]/.test(passphrase)) {
    errors.push("Passphrase must include at least one capital letter");
  }

  // Check for special character (including spaces)
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~\s]/.test(passphrase)) {
    errors.push("Passphrase must include at least one special character or space");
  }

  // Check for number
  if (!/\d/.test(passphrase)) {
    errors.push("Passphrase must include at least one number");
  }

  return errors;
}