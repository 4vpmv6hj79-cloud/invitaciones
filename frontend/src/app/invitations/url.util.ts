// Normaliza un enlace externo genérico (ej. mesa de regalos de una tienda).
// - Si ya trae http(s), se usa tal cual.
// - Si viene sin protocolo (ej. "liverpool.com.mx/..."), se le antepone https://
// - Vacío: devuelve '' (el enlace no se muestra).
export function normalizeUrl(value: string | undefined | null): string {
  if (!value) return '';
  const v = value.trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}
