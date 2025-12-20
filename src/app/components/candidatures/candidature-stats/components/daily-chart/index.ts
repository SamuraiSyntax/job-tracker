/**
 * Barrel export pour le module daily-chart
 */

export { DailyChartComponent } from './daily-chart.component';
export type { ECOption, TooltipPosition } from '@models/daily-chart.types';
export {
    STATUS_COLORS,
    STATUS_LABELS,
    STATUS_ICONS,
    CHART_LEGEND_DATA,
    SERIES_CONFIG,
    type SeriesConfig
} from '@constants/daily-chart.constants';
export {
    generateCandidatureCardHTML,
    generateStatBadgeHTML,
    generateTooltipHTML
} from './utils/daily-chart-tooltip.util';
export { formatDayLabel, extractSeriesData } from './utils/daily-chart.utils';
export { DailyChartEChartsConfig } from './config/daily-chart-echarts.config';
export { TooltipManager } from './managers/daily-chart-tooltip.manager';
export { ChartEventsHandler } from './managers/daily-chart-events.handler';
