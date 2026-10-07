// Normaliza lo que el usuario pega en "Ubicación" para que el botón
// "Ver ubicación" SIEMPRE abra Google Maps correctamente.
//
// Casos que soporta:
//  - URL completa (https://maps.google.com/..., https://maps.app.goo.gl/...): se usa tal cual.
//  - Coordenadas ("19.6042, -99.2004"): abre Maps centrado en ese punto.
//  - Texto / dirección ("Jardín Las Rosas, CDMX"): abre una búsqueda en Maps.
//  - Vacío: devuelve '' (el botón no se muestra).
//
// Esto evita el bug de que, al pegar coordenadas o texto sin http,
// el navegador lo tomara como ruta relativa y volviera a la invitación.
export function normalizeMapsUrl(value: string | undefined | null): string {
  if (!value) return '';
  const v = value.trim();
  if (!v) return '';

  // Ya es un enlace web: usarlo tal cual.
  if (/^https?:\/\//i.test(v)) return v;

  // Coordenadas tipo "lat, lng" o "lat lng".
  const coords = /^(-?\d{1,3}(?:\.\d+)?)[,\s]+(-?\d{1,3}(?:\.\d+)?)$/.exec(v);
  if (coords) {
    const lat = coords[1];
    const lng = coords[2];
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  // Cualquier otro texto: búsqueda por dirección/nombre del lugar.
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v)}`;
}
