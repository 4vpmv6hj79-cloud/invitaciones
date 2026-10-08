// Extrae el ID de video de un enlace de YouTube en sus distintos formatos:
//  - https://www.youtube.com/watch?v=ID
//  - https://youtu.be/ID
//  - https://www.youtube.com/embed/ID
//  - https://music.youtube.com/watch?v=ID
// Devuelve '' si no se reconoce.
export function youtubeId(url: string | undefined | null): string {
  if (!url) return '';
  const v = url.trim();
  if (!v) return '';

  // youtu.be/ID
  let m = /youtu\.be\/([A-Za-z0-9_-]{6,})/.exec(v);
  if (m) return m[1];

  // youtube.com/embed/ID
  m = /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/.exec(v);
  if (m) return m[1];

  // ...watch?v=ID  (y variantes con otros parámetros)
  m = /[?&]v=([A-Za-z0-9_-]{6,})/.exec(v);
  if (m) return m[1];

  // Si pegaron solo el ID.
  if (/^[A-Za-z0-9_-]{6,}$/.test(v)) return v;

  return '';
}
