/**
 * Utilitaires pour les opérations de presse-papier
 */

/**
 * Résultat d'une opération de copie
 */
export interface ClipboardResult {
  success: boolean;
  error?: string;
}

/**
 * Copie du texte dans le presse-papier
 * @param text - Le texte à copier
 * @returns Une promesse avec le résultat de l'opération
 */
export async function copyToClipboard(text: string): Promise<ClipboardResult> {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    return { 
      success: false, 
      error: errorMessage 
    };
  }
}

/**
 * Lit le contenu du presse-papier
 * @returns Une promesse avec le texte lu ou null en cas d'erreur
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    console.error('Erreur lors de la lecture du presse-papier:', error);
    return null;
  }
}

/**
 * Vérifie si l'API Clipboard est disponible
 * @returns true si l'API Clipboard est supportée
 */
export function isClipboardSupported(): boolean {
  return navigator?.clipboard !== undefined;
}

/**
 * Copie du texte avec une méthode de fallback pour les navigateurs anciens
 * @param text - Le texte à copier
 * @returns true si la copie a réussi
 */
export function copyToClipboardLegacy(text: string): boolean {
  try {
    // Créer un élément textarea temporaire
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    // Sélectionner et copier le texte
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const success = document.execCommand('copy');
    
    // Nettoyer
    document.body.removeChild(textarea);
    
    return success;
  } catch (error) {
    console.error('Erreur lors de la copie (fallback):', error);
    return false;
  }
}

/**
 * Copie du texte avec détection automatique de la méthode (moderne ou legacy)
 * @param text - Le texte à copier
 * @returns Une promesse avec le résultat de l'opération
 */
export async function copyToClipboardAuto(text: string): Promise<ClipboardResult> {
  if (isClipboardSupported()) {
    return copyToClipboard(text);
  } else {
    const success = copyToClipboardLegacy(text);
    return {
      success,
      error: success ? undefined : 'Méthode de copie non supportée'
    };
  }
}
