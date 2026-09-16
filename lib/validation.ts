const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const INVISIBLE_DIRECTIONAL_CHARACTERS = /[\u061C\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF]/g;

export function normalizeSingleLine(value: string, maxLength: number): string {
  return value
    .normalize('NFKC')
    .replace(CONTROL_CHARACTERS, '')
    .replace(INVISIBLE_DIRECTIONAL_CHARACTERS, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function normalizeMultiline(value: string, maxLength: number): string {
  return value
    .normalize('NFKC')
    .replace(CONTROL_CHARACTERS, '')
    .replace(INVISIBLE_DIRECTIONAL_CHARACTERS, '')
    .replace(/\r\n?/g, '\n')
    .trim()
    .slice(0, maxLength);
}

export function isValidDni(value: string): boolean {
  return /^\d{8}$/.test(value);
}

export function isValidRuc(value: string): boolean {
  if (!/^\d{11}$/.test(value) || !/^(10|15|17|20)/.test(value)) return false;

  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((total, weight, index) => total + Number(value[index]) * weight, 0);
  const expectedDigit = (11 - (sum % 11)) % 10;
  return expectedDigit === Number(value[10]);
}
