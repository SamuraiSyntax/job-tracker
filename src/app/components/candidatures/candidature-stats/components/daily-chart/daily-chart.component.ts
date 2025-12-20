import { Component, Input, OnChanges, OnDestroy, AfterViewInit, ViewChild, ElementRef, SimpleChanges, signal, effect, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { StatistiquesParJour } from '@models/index';
import { TooltipPosition } from '@models/daily-chart.types';
import { ThemeService } from '@services/theme.service';
import { DailyChartEChartsConfig } from './config/daily-chart-echarts.config';
import { TooltipManager } from './managers/daily-chart-tooltip.manager';
import { ChartEventsHandler } from './managers/daily-chart-events.handler';

// Enregistrer les composants ECharts nécessaires
echarts.use([
    LineChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    CanvasRenderer
]);

@Component({
    selector: 'app-daily-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './daily-chart.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyChartComponent implements AfterViewInit, OnChanges, OnDestroy {
    @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
    @Input({ required: true }) dailyStats!: StatistiquesParJour[];

    private chartInstance: echarts.ECharts | null = null;
    private viewInitialized = false;
    private lockedTooltipPosition = signal<TooltipPosition | null>(null);

    // Gestionnaires
    private tooltipManager?: TooltipManager;
    private eventsHandler?: ChartEventsHandler;

    // Services
    private themeService = inject(ThemeService);

    private router = inject(Router);

    constructor() {
        // Exposer la méthode de navigation à l'objet window pour l'accès depuis le tooltip
        (window as unknown as { navigateToCandidature: (id: number) => void }).navigateToCandidature = (id: number) => {
            this.router.navigate(['/candidatures', id]);
        };

        // Réagir aux changements de thème
        effect(() => {
            // Lire le thème actuel pour créer la dépendance
            const theme = this.themeService.effectiveTheme();
            const isDark = theme === 'dark';

            // Si le tooltip est verrouillé, mettre à jour uniquement son thème
            if (this.tooltipManager?.isLocked()) {
                this.tooltipManager.updateTheme(isDark);
                // Mettre à jour aussi le gestionnaire d'événements
                this.eventsHandler?.updateTheme(isDark);
            }

            // Réinitialiser le graphique si déjà initialisé
            if (this.viewInitialized && this.dailyStats && this.dailyStats.length > 0) {
                this.initializeChart();
            }
        });
    }

    ngAfterViewInit(): void {
        this.viewInitialized = true;
        if (this.dailyStats && this.dailyStats.length > 0) {
            this.initializeChart();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['dailyStats'] && !changes['dailyStats'].firstChange) {
            if (this.viewInitialized && this.dailyStats && this.dailyStats.length > 0) {
                this.initializeChart();
            }
        }
    }

    ngOnDestroy(): void {
        this.cleanup();
    }

    private initializeChart(): void {
        setTimeout(() => {
            if (!this.chartContainer?.nativeElement) {
                return;
            }

            // Nettoyer l'instance existante
            this.cleanup();

            // Créer une nouvelle instance
            this.chartInstance = echarts.init(this.chartContainer.nativeElement);

            // Initialiser les gestionnaires
            this.tooltipManager = new TooltipManager(this.lockedTooltipPosition);
            this.eventsHandler = new ChartEventsHandler(
                this.chartInstance,
                this.chartContainer,
                this.dailyStats,
                this.tooltipManager,
                this.themeService.effectiveTheme() === 'dark'
            );

            // Configurer les options ECharts
            const config = new DailyChartEChartsConfig(
                this.dailyStats,
                () => this.tooltipManager?.isLocked() ?? false,
                () => this.tooltipManager?.getLockedHTML() ?? '',
                (html: string) => this.tooltipManager?.setLockedHTML(html),
                this.themeService.effectiveTheme()
            );

            // Appliquer les options et initialiser les événements
            this.chartInstance.setOption(config.buildOptions());
            this.eventsHandler.initialize();
        }, 0);
    }

    private cleanup(): void {
        if (this.eventsHandler) {
            this.eventsHandler.destroy();
            this.eventsHandler = undefined;
        }

        if (this.tooltipManager) {
            this.tooltipManager.destroy();
            this.tooltipManager = undefined;
        }

        if (this.chartInstance) {
            this.chartInstance.dispose();
            this.chartInstance = null;
        }
    }
}