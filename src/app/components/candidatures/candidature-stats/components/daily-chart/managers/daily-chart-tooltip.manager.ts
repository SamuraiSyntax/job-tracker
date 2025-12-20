import { WritableSignal } from '@angular/core';
import { TooltipPosition } from '@models/daily-chart.types';
import { StatistiquesParJour } from '@models/index';
import { SERIES_CONFIG } from '@constants/daily-chart.constants';
import { formatDayLabel } from '../utils/daily-chart.utils';
import { generateTooltipHTML } from '../utils/daily-chart-tooltip.util';

/**
 * Gestionnaire pour le tooltip verrouillé
 */
export class TooltipManager {
    private tooltipLocked = false;
    private lockedDataIndex = -1;
    private lockedTooltipHTML = '';
    private tooltipPositionObserver?: MutationObserver;
    private currentTheme: 'light' | 'dark' = 'light';
    private currentDailyStats: StatistiquesParJour[] = [];

    constructor(
        private lockedTooltipPosition: WritableSignal<TooltipPosition | null>
    ) { }

    /**
     * Vérifie si le tooltip est verrouillé
     */
    isLocked(): boolean {
        return this.tooltipLocked;
    }

    /**
     * Récupère le HTML du tooltip verrouillé
     */
    getLockedHTML(): string {
        return this.lockedTooltipHTML;
    }

    /**
     * Définit le HTML du tooltip verrouillé
     */
    setLockedHTML(html: string): void {
        this.lockedTooltipHTML = html;
    }

    /**
     * Verrouille le tooltip pour un index de données donné
     */
    lock(dataIndex: number, dailyStats: StatistiquesParJour[], isDark = false): void {
        this.tooltipLocked = true;
        this.lockedDataIndex = dataIndex;
        this.currentTheme = isDark ? 'dark' : 'light';
        this.currentDailyStats = dailyStats;

        // Générer le HTML avec cadenas
        const dayData = dailyStats[dataIndex];
        const date = formatDayLabel(dayData.jour);

        const params = SERIES_CONFIG.map(config => ({
            seriesName: config.name,
            value: Number((dayData as unknown as Record<string, unknown>)[config.dataKey]),
            color: config.color
        }));

        // Cast candidatures as Candidature[] for type safety
        this.lockedTooltipHTML = generateTooltipHTML(
            date,
            params,
            (dayData.candidatures || []) as import('@models/candidature.model').Candidature[],
            true,
            isDark
        );

        // Attendre que le tooltip soit dans le DOM
        setTimeout(() => {
            this.captureTooltipPosition();
        }, 50);
    }

    /**
     * Déverrouille le tooltip
     */
    unlock(): void {
        // Régénérer le tooltip sans le cadenas avant de déverrouiller
        if (this.lockedDataIndex !== -1 && this.currentDailyStats.length > 0) {
            const dayData = this.currentDailyStats[this.lockedDataIndex];
            const date = formatDayLabel(dayData.jour);

            const params = SERIES_CONFIG.map(config => ({
                seriesName: config.name,
                value: Number((dayData as unknown as Record<string, unknown>)[config.dataKey]),
                color: config.color
            }));

            const unlockedHTML = generateTooltipHTML(
                date,
                params,
                (dayData.candidatures || []) as import('@models/candidature.model').Candidature[],
                false,
                this.currentTheme === 'dark'
            );

            // Mettre à jour le contenu du tooltip dans le DOM
            const tooltipElement = document.querySelector('.candidature-stats-tooltip') as HTMLElement;
            if (tooltipElement) {
                const contentDiv = tooltipElement.querySelector('div') as HTMLElement;
                if (contentDiv) {
                    contentDiv.outerHTML = unlockedHTML;
                }
            }
        }

        this.tooltipLocked = false;
        this.lockedDataIndex = -1;
        this.lockedTooltipHTML = '';
        this.lockedTooltipPosition.set(null);

        // Réactiver les transitions
        const tooltipElement = document.querySelector('.candidature-stats-tooltip') as HTMLElement;
        if (tooltipElement) {
            tooltipElement.style.transition = '';
        }

        // Arrêter l'observation
        this.stopPositionMonitoring();
    }

    /**
     * Bascule l'état de verrouillage
     */
    toggle(dataIndex: number, dailyStats: StatistiquesParJour[], isDark = false): void {
        if (this.tooltipLocked) {
            this.unlock();
        } else {
            this.lock(dataIndex, dailyStats, isDark);
        }
    }

    /**
     * Met à jour le thème du tooltip verrouillé
     */
    updateTheme(isDark: boolean): void {
        if (!this.tooltipLocked || this.lockedDataIndex === -1) {
            return;
        }

        this.currentTheme = isDark ? 'dark' : 'light';

        // Régénérer le HTML avec le nouveau thème
        const dayData = this.currentDailyStats[this.lockedDataIndex];
        const date = formatDayLabel(dayData.jour);

        const params = SERIES_CONFIG.map(config => ({
            seriesName: config.name,
            value: Number((dayData as unknown as Record<string, unknown>)[config.dataKey]),
            color: config.color
        }));

        this.lockedTooltipHTML = generateTooltipHTML(
            date,
            params,
            (dayData.candidatures || []) as import('@models/candidature.model').Candidature[],
            true,
            isDark
        );

        // Mettre à jour le contenu du tooltip dans le DOM
        setTimeout(() => {
            const tooltipElement = document.querySelector('.candidature-stats-tooltip') as HTMLElement;
            if (tooltipElement) {
                const contentDiv = tooltipElement.querySelector('div') as HTMLElement;
                if (contentDiv && this.lockedTooltipHTML) {
                    contentDiv.outerHTML = this.lockedTooltipHTML;
                }
            }
        }, 0);
    }

    /**
     * Capture la position du tooltip pour la verrouiller
     */
    private captureTooltipPosition(): void {
        const tooltipElement = document.querySelector('.candidature-stats-tooltip') as HTMLElement;
        if (!tooltipElement) return;

        const transform = tooltipElement.style.transform;
        if (transform && transform.includes('translate3d')) {
            const match = transform.match(/translate3d\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
            if (match) {
                const left = match[1].trim();
                const top = match[2].trim();
                this.lockedTooltipPosition.set({ left, top });

                // Désactiver les transitions et optimiser le rendu
                tooltipElement.style.transition = 'none';
                tooltipElement.style.setProperty('-webkit-font-smoothing', 'antialiased');
                tooltipElement.style.backfaceVisibility = 'hidden';
                tooltipElement.style.transform = `translate3d(${left}, ${top}, 0px) translateZ(0)`;

                this.startPositionMonitoring(tooltipElement);

                // Forcer le rafraîchissement du contenu
                const contentDiv = tooltipElement.querySelector('div') as HTMLElement;
                if (contentDiv && this.lockedTooltipHTML) {
                    contentDiv.outerHTML = this.lockedTooltipHTML;
                }
            }
        }
    }

    /**
     * Démarre la surveillance de la position du tooltip
     */
    private startPositionMonitoring(tooltipElement: HTMLElement): void {
        this.stopPositionMonitoring();

        const lockedPos = this.lockedTooltipPosition();
        if (!lockedPos) return;

        this.tooltipPositionObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target as HTMLElement;
                    const currentPos = this.lockedTooltipPosition();

                    if (this.tooltipLocked && currentPos) {
                        const expectedTransform = `translate3d(${currentPos.left}, ${currentPos.top}, 0px) translateZ(0)`;

                        if (target.style.transform !== expectedTransform) {
                            target.style.transform = expectedTransform;
                            target.style.transition = 'none';
                            target.style.setProperty('-webkit-font-smoothing', 'antialiased');
                            target.style.backfaceVisibility = 'hidden';
                        }
                    }
                }
            });
        });

        this.tooltipPositionObserver.observe(tooltipElement, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    /**
     * Arrête la surveillance de la position
     */
    private stopPositionMonitoring(): void {
        if (this.tooltipPositionObserver) {
            this.tooltipPositionObserver.disconnect();
            this.tooltipPositionObserver = undefined;
        }
    }

    /**
     * Nettoie les ressources
     */
    destroy(): void {
        this.stopPositionMonitoring();
        this.unlock();
    }
}
