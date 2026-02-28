export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}