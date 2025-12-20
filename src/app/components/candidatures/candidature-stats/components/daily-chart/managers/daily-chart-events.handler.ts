import * as echarts from 'echarts/core';
import { ElementRef } from '@angular/core';
import { StatistiquesParJour } from '@models/index';
import { TooltipManager } from './daily-chart-tooltip.manager';

/**
 * Gestionnaire des événements du graphique
 */
export class ChartEventsHandler {
    private resizeHandler?: () => void;
    private clickOutsideListener?: (event: MouseEvent) => void;
    private isDark = false;

    constructor(
        private chartInstance: echarts.ECharts,
        private chartContainer: ElementRef,
        private dailyStats: StatistiquesParJour[],
        private tooltipManager: TooltipManager,
        isDark = false
    ) {
        this.isDark = isDark;
    }

    /**
     * Initialise tous les événements
     */
    initialize(): void {
        this.setupChartClickHandler();
        this.setupOutsideClickHandler();
        this.setupResizeHandler();
    }

    /**
     * Configure le gestionnaire de clic sur le graphique
     */
    private setupChartClickHandler(): void {
        this.chartContainer.nativeElement.addEventListener('click', (event: MouseEvent) => {
            if (!this.chartInstance) return;

            // Obtenir la position du clic
            const rect = this.chartContainer.nativeElement.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Convertir en coordonnées de données
            const pointInPixel = [x, y];
            const pointInGrid = this.chartInstance.convertFromPixel(
                { seriesIndex: 0 },
                pointInPixel
            );

            if (pointInGrid && Array.isArray(pointInGrid)) {
                const dataIndex = Math.round(pointInGrid[0]);

                // Vérifier la validité de l'index
                if (dataIndex >= 0 && dataIndex < this.dailyStats.length) {
                    this.tooltipManager.toggle(dataIndex, this.dailyStats, this.isDark);
                }
            }
        });
    }

    /**
     * Configure le gestionnaire de clic en dehors du graphique
     */
    private setupOutsideClickHandler(): void {
        if (this.clickOutsideListener) return;

        this.clickOutsideListener = (event: MouseEvent) => {
            const chartElement = this.chartContainer.nativeElement;
            const target = event.target as HTMLElement;

            const isInsideChart = chartElement.contains(target);
            const isInsideTooltip = !!target.closest('.echarts-tooltip');

            // Clic en dehors = déverrouiller
            if (!isInsideChart && !isInsideTooltip && this.tooltipManager.isLocked()) {
                this.tooltipManager.unlock();
            }
        };

        document.addEventListener('click', this.clickOutsideListener);
    }

    /**
     * Configure le gestionnaire de redimensionnement
     */
    private setupResizeHandler(): void {
        if (this.resizeHandler) return;

        this.resizeHandler = () => {
            if (this.chartInstance) {
                this.chartInstance.resize();
            }
        };

        window.addEventListener('resize', this.resizeHandler);
    }

    /**
     * Met à jour le thème
     */
    updateTheme(isDark: boolean): void {
        this.isDark = isDark;
    }

    /**
     * Nettoie tous les événements
     */
    destroy(): void {
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = undefined;
        }

        if (this.clickOutsideListener) {
            document.removeEventListener('click', this.clickOutsideListener);
            this.clickOutsideListener = undefined;
        }
    }
}
