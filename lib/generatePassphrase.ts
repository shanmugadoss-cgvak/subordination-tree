const SPECIAL_CHARACTERS = "!@#$%^&*()_+[]{}|;:,.<>?";
const CAPITAL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const ALL_CHARACTERS = SPECIAL_CHARACTERS + CAPITAL_LETTERS + LOWERCASE_LETTERS + NUMBERS + " ";

function getRandomCharacter(characters: string): string {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}

export function generatePassphrase(): string {
  let passphrase = "";

  // Ensure at least one special character
  passphrase += getRandomCharacter(SPECIAL_CHARACTERS);

  // Ensure at least one capital letter
  passphrase += getRandomCharacter(CAPITAL_LETTERS);

  // Fill the rest of the passphrase with random characters
  for (let i = passphrase.length; i < 20; i++) {
    passphrase += getRandomCharacter(ALL_CHARACTERS);
  }

  // Shuffle the passphrase to ensure randomness
  passphrase = passphrase.split('').sort(() => 0.5 - Math.random()).join('');

  return passphrase;
}