// Formatea una hora "HH:mm" (24h) a formato de 12 horas con a.m./p.m.
// Ej: "10:00" -> "10:00 a.m.", "23:30" -> "11:30 p.m.".
// Si el valor no es válido, lo devuelve tal cual.
export function formatTime12h(time: string | undefined | null): string {
  if (!time) return '';
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return time;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  if (isNaN(hours) || hours < 0 || hours > 23) return time;

  const period = hours >= 12 ? 'p.m.' : 'a.m.';
  hours = hours % 12;
  if (hours === 0) hours = 12; // medianoche y mediodía

  return `${hours}:${minutes} ${period}`;
}
