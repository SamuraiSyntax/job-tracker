import { Injectable, signal, effect, Renderer2, RendererFactory2, inject } from '@angular/core';
import { Theme } from '@models/index';

/**
 * Service de gestion du thème de l'application
 * 
 * Gère le mode clair/sombre/automatique de l'interface utilisateur.
 * Synchronise avec les préférences système et persiste le choix dans localStorage.
 * Utilise des signals Angular pour une réactivité optimale.
 * 
 * @example
 * ```typescript
 * // Injection du service
 * private themeService = inject(ThemeService);
 * 
 * // Lire le thème actuel
 * const theme = this.themeService.currentTheme();
 * const effectif = this.themeService.effectiveTheme();
 * 
 * // Changer le thème
 * this.themeService.setTheme('dark');
 * 
 * // Basculer entre clair/sombre
 * this.themeService.toggleTheme();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'job-tracker-theme';
  private renderer: Renderer2 = inject(RendererFactory2).createRenderer(null, null);

  currentTheme = signal<Theme>(this.getStoredTheme());
  effectiveTheme = signal<'light' | 'dark'>('light');

  constructor() {
    // Effet pour appliquer le thème quand il change
    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
    });

    // Écouter les changements de préférence système
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', () => {
        if (this.currentTheme() === 'auto') {
          this.updateEffectiveTheme('auto');
        }
      });
    }

    // Appliquer le thème initial
    this.applyTheme(this.currentTheme());
  }

  /**
   * Change le thème de l'application
   * 
   * Met à jour le signal currentTheme et persiste le choix dans localStorage.
   * Le thème est automatiquement appliqué grâce à l'effect.
   * 
   * @param theme - Nouveau thème à appliquer ('light', 'dark', ou 'auto')
   * 
   * @example
   * ```typescript
   * // Mode sombre
   * this.themeService.setTheme('dark');
   * 
   * // Mode automatique (suit les préférences système)
   * this.themeService.setTheme('auto');
   * ```
   */
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    localStorage.setItem(this.THEME_STORAGE_KEY, theme);
  }

  /**
   * Récupère le thème stocké dans localStorage
   * 
   * @returns Theme stocké, ou 'light' par défaut si aucun n'est trouvé
   * @private
   */
  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      return stored;
    }
    return 'light'; // Thème par défaut
  }

  /**
   * Applique le thème au DOM
   * 
   * - Met à jour le signal effectiveTheme
   * - Ajoute/retire la classe 'dark' sur <html> pour Tailwind CSS
   * - Met à jour la meta color-scheme pour le navigateur
   * 
   * @param theme - Thème à appliquer
   * @private
   */
  private applyTheme(theme: Theme): void {
    this.updateEffectiveTheme(theme);
    
    const effectiveTheme = this.effectiveTheme();
    const html = document.documentElement;
    
    // Gérer la classe 'dark' pour Tailwind
    if (effectiveTheme === 'dark') {
      this.renderer.addClass(html, 'dark');
    } else {
      this.renderer.removeClass(html, 'dark');
    }
    
    // Mettre à jour la meta color-scheme
    this.updateColorScheme(effectiveTheme);
  }

  /**
   * Met à jour le thème effectif en fonction du thème choisi
   * 
   * Si le thème est 'auto', détecte la préférence système via media query.
   * Sinon, utilise directement le thème spécifié.
   * 
   * @param theme - Thème source pour déterminer le thème effectif
   * @private
   */
  private updateEffectiveTheme(theme: Theme): void {
    if (theme === 'auto') {
      // Détecter la préférence système
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.effectiveTheme.set(prefersDark ? 'dark' : 'light');
    } else {
      this.effectiveTheme.set(theme);
    }
  }

  /**
   * Met à jour la meta color-scheme pour le navigateur
   * 
   * Permet au navigateur d'adapter les éléments natifs (scrollbars, etc.)
   * au thème de l'application.
   * 
   * @param scheme - Schéma de couleur à appliquer ('light' ou 'dark')
   * @private
   */
  private updateColorScheme(scheme: 'light' | 'dark'): void {
    let metaTag = document.querySelector('meta[name="color-scheme"]');
    
    if (!metaTag) {
      metaTag = this.renderer.createElement('meta');
      this.renderer.setAttribute(metaTag, 'name', 'color-scheme');
      this.renderer.appendChild(document.head, metaTag);
    }
    
    this.renderer.setAttribute(metaTag, 'content', scheme);
  }

  /**
   * Bascule entre les modes clair et sombre
   * 
   * Si le thème actuel est 'light', passe à 'dark' et vice-versa.
   * Si le thème est 'auto', bascule vers le mode opposé au thème effectif actuel.
   * 
   * @example
   * ```typescript
   * // Dans un bouton de bascule de thème
   * onToggleTheme() {
   *   this.themeService.toggleTheme();
   * }
   * ```
   */
  toggleTheme(): void {
    const current = this.effectiveTheme();
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }
}
