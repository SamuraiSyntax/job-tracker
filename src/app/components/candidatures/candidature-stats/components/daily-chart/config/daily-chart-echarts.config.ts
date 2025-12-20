import { StatistiquesParJour } from '@models/index';
import { ECOption } from '@models/daily-chart.types';
import { CHART_LEGEND_DATA, SERIES_CONFIG } from '@constants/daily-chart.constants';
import { formatDayLabel, extractSeriesData } from '../utils/daily-chart.utils';
import { generateTooltipHTML } from '../utils/daily-chart-tooltip.util';
import { Candidature } from '@models/candidature.model';

/**
 * Configuration et construction des options ECharts
 */
export class DailyChartEChartsConfig {
    private isDark: boolean;

    constructor(
        private dailyStats: StatistiquesParJour[],
        private isTooltipLocked: () => boolean,
        private getLockedTooltipHTML: () => string,
        private setLockedTooltipHTML: (html: string) => void,
        theme: 'light' | 'dark'
    ) {
        this.isDark = theme === 'dark';
    }

    /**
     * Construit les options complètes pour ECharts
     */
    buildOptions(): ECOption {
        const dates = this.dailyStats.map(stat => formatDayLabel(stat.jour));

        return {
            tooltip: this.buildTooltipConfig(),
            legend: this.buildLegendConfig(),
            grid: this.buildGridConfig(),
            xAxis: this.buildXAxisConfig(dates),
            yAxis: this.buildYAxisConfig(),
            series: this.buildSeriesConfig(),
            animation: true,
            animationDuration: 1000,
            animationEasing: 'cubicOut'
        };
    }

    /**
     * Configure le tooltip
     */
    private buildTooltipConfig(): Record<string, unknown> {
        return {
            trigger: 'axis',
            backgroundColor: this.isDark ? 'rgba(31, 41, 55, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            borderColor: this.isDark ? '#374151' : '#e5e7eb',
            borderWidth: 1,
            padding: 0,
            textStyle: {
                color: this.isDark ? '#f3f4f6' : '#111827'
            },
            triggerOn: this.isTooltipLocked() ? 'none' : 'mousemove',
            enterable: true,
            alwaysShowContent: this.isTooltipLocked(),
            hideDelay: 200,
            confine: false,
            appendToBody: true,
            className: 'candidature-stats-tooltip',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6366f1'
                }
            },
            formatter: (params: unknown) => this.formatTooltip(params)
        };
    }

    /**
     * Formatte le contenu du tooltip
     */
    private formatTooltip(params: unknown): string {
        if (!Array.isArray(params) || params.length === 0) {
            return '';
        }

        // Si verrouillé ET qu'on a déjà le HTML stocké, le retourner directement
        if (this.isTooltipLocked() && this.getLockedTooltipHTML()) {
            return this.getLockedTooltipHTML();
        }

        // Générer le HTML normalement
        // params is expected to be an array of objects with dataIndex and axisValue
        const arr = params as { dataIndex: number; axisValue: string }[];
        const dataIndex = arr[0].dataIndex;
        const dayData = this.dailyStats[dataIndex];
        const date = arr[0].axisValue;

        const result = generateTooltipHTML(
            date,
            params,
            (dayData.candidatures || []) as Candidature[],
            false,
            this.isDark
        );

        // Si on vient de verrouiller, stocker le HTML avec l'icône de cadenas
        if (this.isTooltipLocked() && !this.getLockedTooltipHTML()) {
            const lockedHTML = generateTooltipHTML(
                date,
                params,
                (dayData.candidatures || []) as Candidature[],
                true,
                this.isDark
            );
            this.setLockedTooltipHTML(lockedHTML);
            return lockedHTML;
        }

        return result;
    }

    /**
     * Configure la légende
     */
    private buildLegendConfig(): Record<string, unknown> {
        return {
            data: CHART_LEGEND_DATA,
            top: 10,
            textStyle: {
                fontSize: 11,
                color: this.isDark ? '#d1d5db' : '#374151'
            },
            type: 'scroll'
        };
    }

    /**
     * Configure la grille
     */
    private buildGridConfig(): Record<string, unknown> {
        return {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '20%',
            containLabel: true
        };
    }

    /**
     * Configure l'axe X
     */
    private buildXAxisConfig(dates: string[]): Record<string, unknown> {
        return {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLabel: {
                rotate: 45,
                fontSize: 10,
                interval: 0,
                color: this.isDark ? '#9ca3af' : '#6b7280'
            },
            axisLine: {
                lineStyle: {
                    color: this.isDark ? '#4b5563' : '#d1d5db'
                }
            },
            splitLine: {
                lineStyle: {
                    color: this.isDark ? '#374151' : '#f3f4f6'
                }
            }
        };
    }

    /**
     * Configure l'axe Y
     */
    private buildYAxisConfig(): Record<string, unknown> {
        return {
            type: 'value',
            name: 'Candidatures',
            minInterval: 1,
            nameTextStyle: {
                fontSize: 12,
                color: this.isDark ? '#d1d5db' : '#374151'
            },
            axisLabel: {
                color: this.isDark ? '#9ca3af' : '#6b7280'
            },
            axisLine: {
                lineStyle: {
                    color: this.isDark ? '#4b5563' : '#d1d5db'
                }
            },
            splitLine: {
                lineStyle: {
                    color: this.isDark ? '#374151' : '#f3f4f6'
                }
            }
        };
    }

    /**
     * Configure les séries de données
     */
    private buildSeriesConfig(): Record<string, unknown>[] {
        return SERIES_CONFIG.map(config => ({
            // ...existing code...
            name: config.name,
            type: 'line' as const,
            smooth: true,
            data: extractSeriesData(this.dailyStats, config.dataKey as keyof StatistiquesParJour),
            itemStyle: { color: config.color },
            lineStyle: { width: 2 },
            areaStyle: {
                opacity: 0.3,
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: config.color },
                        { offset: 1, color: `${config.color}1a` }
                    ]
                }
            },
            emphasis: {
                focus: 'series'
            }
        }));
    }
}
