// Convert a date to a string in the format HH:MM:SS DD/MM/YYYY
export function convertToDateString(date: Date) {
  const padNumber = (num: number) => String(num).padStart(2, "0");
  const day = padNumber(date.getDate());
  const month = padNumber(date.getMonth() + 1);
  const year = date.getFullYear();
  const hour = padNumber(date.getHours());
  const minute = padNumber(date.getMinutes());
  const second = padNumber(date.getSeconds());
  return `${hour}:${minute}:${second} ${day}/${month}/${year}`;
}
