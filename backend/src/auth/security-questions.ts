// Catálogo de preguntas de seguridad para la recuperación de contraseña sin correo.
// El frontend muestra el texto; en la base solo se guarda el id (clave) elegido.

export interface SecurityQuestion {
  id: string;
  text: string;
}

export const SECURITY_QUESTIONS: SecurityQuestion[] = [
  { id: 'pet', text: '¿Cuál fue el nombre de tu primera mascota?' },
  { id: 'city', text: '¿En qué ciudad naciste?' },
  { id: 'school', text: '¿Cuál fue el nombre de tu primera escuela?' },
  { id: 'mother', text: '¿Cuál es el segundo nombre de tu madre?' },
  { id: 'nickname', text: '¿Cuál era tu apodo de la infancia?' },
  { id: 'favoriteTeacher', text: '¿Cómo se llamaba tu maestro(a) favorito(a)?' },
  { id: 'favoriteFood', text: '¿Cuál es tu platillo favorito?' },
];

const VALID_IDS = new Set(SECURITY_QUESTIONS.map((q) => q.id));

export function isValidQuestionId(id: string | undefined | null): boolean {
  return !!id && VALID_IDS.has(id);
}

// Normaliza la respuesta para comparar sin depender de mayúsculas/espacios/acentos.
export function normalizeAnswer(answer: string): string {
  return answer
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/\s+/g, ' ');
}
