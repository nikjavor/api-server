export function clamp(v: number, min: number, max: number): number {
  return Math.max(Math.min(v, max), min);
}

export function coloredString(text: string, r: number, g: number, b: number) {
  const bg = `\x1b[48;2;${r};${g};${b}m`;
  const reset = "\x1b[0m";

  return `${bg}${text}${reset}`;
}
