/** Documents acceptés par les formulaires publics (CV, pièce jointe de contact) : mêmes règles que l'API. */
export const DOCUMENT_EXTENSIONS = [".pdf", ".doc", ".docx"];
export const MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo

/** Renvoie un message d'erreur, ou null si le fichier est acceptable. */
export function checkDocument(file: File, what = "Le fichier"): string | null {
  const ext = file.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] ?? "";
  if (!DOCUMENT_EXTENSIONS.includes(ext)) return "Format non supporté (PDF, DOC ou DOCX uniquement).";
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) return `${what} ne doit pas dépasser 5 Mo.`;
  return null;
}
