import { LineSeriesOption } from 'echarts/charts';
import {
    GridComponentOption,
    TooltipComponentOption,
    LegendComponentOption,
    TitleComponentOption
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';

/**
 * Type pour les options ECharts du graphique quotidien
 */
export type ECOption = ComposeOption<
    | LineSeriesOption
    | GridComponentOption
    | TooltipComponentOption
    | LegendComponentOption
    | TitleComponentOption
>;

/**
 * Position du tooltip verrouillé
 */
export interface TooltipPosition {
    left: string;
    top: string;
}
