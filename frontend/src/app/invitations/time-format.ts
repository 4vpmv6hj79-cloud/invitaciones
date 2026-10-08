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

// Formatea una fecha "YYYY-MM-DD" a texto en español: "19 de diciembre de 2026".
// Si el valor no es válido, lo devuelve tal cual.
export function formatDateLong(date: string | undefined | null): string {
  if (!date) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!match) return date;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  if (month < 1 || month > 12) return date;

  return `${day} de ${meses[month - 1]} de ${year}`;
}
