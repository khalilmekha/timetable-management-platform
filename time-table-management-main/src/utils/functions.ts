export function randomElement<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function getAbbreviation(name: string): string {
  const words = name.split(" ");
  if (words.length === 1) {
    return words[0].substring(0, 3).toUpperCase();
  }
  const firstLetters = words.map((word) => word.charAt(0).toUpperCase());
  return firstLetters.join("");
}
