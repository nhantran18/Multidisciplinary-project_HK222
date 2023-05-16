export function roundToDecimalPlaces(num: number, decimalPlaces: number = 0) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}
