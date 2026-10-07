import { EventData } from './invitation.model';

// Utilidades de calendario para el evento (y la misa, si aplica).
// Ofrece dos vías porque ninguna funciona en todos los dispositivos por sí sola:
//  - Enlace de Google Calendar (web): ideal para Android y escritorio.
//  - Archivo .ics vía Blob: ideal para iPhone/Mac/Outlook.

// 'YYYY-MM-DD' + 'HH:mm' -> 'YYYYMMDDTHHMMSS' (hora local, sin zona).
function toLocalStamp(date: string, time: string | undefined): string | null {
  if (!date) return null;
  const cleanDate = date.replace(/-/g, '');
  const cleanTime = (time || '00:00').replace(':', '') + '00';
  return `${cleanDate}T${cleanTime}`;
}

// Suma horas a 'HH:mm' y devuelve 'HH:mm' (acotado al mismo día).
function addHours(time: string | undefined, hours: number): string {
  const [h, m] = (time || '00:00').split(':').map((n) => parseInt(n, 10) || 0);
  const end = Math.min(h + hours, 23);
  return `${String(end).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Escapa caracteres especiales según iCalendar.
function esc(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

interface CalEvent {
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

// Devuelve los eventos de la invitación (principal + misa si aplica).
function buildEvents(title: string, data: EventData): CalEvent[] {
  if (!data?.date) return [];
  const eventTitle = title || 'Evento';
  const events: CalEvent[] = [
    {
      title: eventTitle,
      date: data.date,
      startTime: data.time,
      endTime: data.endTime || addHours(data.time, 3),
      location: data.locationName,
    },
  ];
  if (data.religiousEnabled && data.religiousTime) {
    const sameLoc = data.religiousSameLocation;
    events.push({
      title: `${eventTitle} — ${data.religiousTitle?.trim() || 'Evento religioso'}`,
      date: data.date,
      startTime: data.religiousTime,
      endTime: addHours(data.religiousTime, 2),
      location: sameLoc ? data.locationName : data.religiousLocationName,
    });
  }
  return events;
}

// ---- Archivo .ics (Blob) para Apple Calendar / Outlook ----

// Construye el contenido .ics con CRLF (requerido por el estándar).
export function buildIcsContent(title: string, data: EventData): string | null {
  const events = buildEvents(title, data);
  if (events.length === 0) return null;

  const lines: string[] = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitaciones//ES', 'CALSCALE:GREGORIAN'];
  for (const ev of events) {
    const start = toLocalStamp(ev.date, ev.startTime);
    if (!start) continue;
    const end = toLocalStamp(ev.date, ev.endTime);
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${Date.now()}-${Math.random().toString(36).slice(2)}@invitaciones`);
    lines.push(`DTSTAMP:${start}`);
    lines.push(`SUMMARY:${esc(ev.title)}`);
    lines.push(`DTSTART:${start}`);
    if (end) lines.push(`DTEND:${end}`);
    if (ev.location) lines.push(`LOCATION:${esc(ev.location)}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  // El estándar iCalendar requiere terminadores CRLF.
  return lines.join('\r\n');
}

// Descarga el .ics usando un Blob (más confiable que data: URL en móviles).
export function downloadIcs(title: string, data: EventData): void {
  const content = buildIcsContent(title, data);
  if (!content) return;
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(title || 'evento').replace(/\s+/g, '-').toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Libera el objeto tras un instante.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---- Enlace de Google Calendar (web) ----

// Genera un enlace que abre Google Calendar con el evento principal precargado.
// Funciona en cualquier dispositivo sin descargar archivos.
export function buildGoogleCalendarUrl(title: string, data: EventData): string | null {
  const events = buildEvents(title, data);
  if (events.length === 0) return null;
  const ev = events[0]; // el evento principal

  const start = toLocalStamp(ev.date, ev.startTime);
  const end = toLocalStamp(ev.date, ev.endTime);
  if (!start) return null;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates: `${start}/${end || start}`,
  });
  if (ev.location) params.set('location', ev.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
