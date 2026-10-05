import { EventData } from './invitation.model';

// Genera un archivo .ics (iCalendar) con el evento principal y, si aplica,
// el evento religioso (misa) como un segundo VEVENT.
// Devuelve una data URL lista para usar en un <a href> con download.
//
// Compatibilidad: el .ics es el formato estándar que entienden Apple Calendar,
// Google Calendar y Outlook. Al abrirlo, el usuario puede agregar el evento.

// Convierte 'YYYY-MM-DD' + 'HH:mm' al formato de fecha-hora local de iCalendar: 'YYYYMMDDTHHMMSS'.
function toIcsDateTime(date: string, time: string | undefined): string | null {
  if (!date) return null;
  const cleanDate = date.replace(/-/g, '');
  const cleanTime = (time || '00:00').replace(':', '') + '00';
  return `${cleanDate}T${cleanTime}`;
}

// Suma horas a un 'HH:mm' y devuelve 'HH:mm' (acotado al mismo día).
function addHours(time: string | undefined, hours: number): string {
  const [h, m] = (time || '00:00').split(':').map((n) => parseInt(n, 10) || 0);
  const end = Math.min(h + hours, 23);
  return `${String(end).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Escapa caracteres especiales según la especificación iCalendar.
function esc(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

interface VEventInput {
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

function buildVEvent(input: VEventInput): string[] {
  const start = toIcsDateTime(input.date, input.startTime);
  if (!start) return [];
  const end = toIcsDateTime(input.date, input.endTime ?? addHours(input.startTime, 3));
  const lines = [
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@invitaciones`,
    `SUMMARY:${esc(input.title)}`,
    `DTSTART:${start}`,
  ];
  if (end) lines.push(`DTEND:${end}`);
  if (input.location) lines.push(`LOCATION:${esc(input.location)}`);
  lines.push('END:VEVENT');
  return lines;
}

// Construye el .ics completo a partir del contenido del evento.
// Incluye el evento principal y, si religiousEnabled, el evento religioso.
export function buildCalendarHref(title: string, data: EventData): string | null {
  if (!data?.date) return null;

  const eventTitle = title || 'Evento';
  const vevents: string[] = [];

  // Evento principal. Usa la hora de fin indicada; si no hay, estima +3 h.
  vevents.push(
    ...buildVEvent({
      title: eventTitle,
      date: data.date,
      startTime: data.time,
      endTime: data.endTime || addHours(data.time, 3),
      location: data.locationName,
    }),
  );

  // Evento religioso (misa), si está activo y tiene hora.
  if (data.religiousEnabled && data.religiousTime) {
    const sameLoc = data.religiousSameLocation;
    vevents.push(
      ...buildVEvent({
        title: `${eventTitle} — Evento religioso`,
        date: data.date,
        startTime: data.religiousTime,
        // La misa suele durar ~1.5 h; estimamos fin.
        endTime: addHours(data.religiousTime, 2),
        location: sameLoc ? data.locationName : data.religiousLocationName,
      }),
    );
  }

  if (vevents.length === 0) return null;

  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitaciones//ES', ...vevents, 'END:VCALENDAR'].join('\n');
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
}
