import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Candidature, StatutCandidature, Priorite, TypeContrat } from '@models/index';
import { getStatutLabel, getPrioriteLabel, getTypeContratLabel } from '@core/utils';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';

@Component({
    selector: '[appTableRow]',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, TimeAgoPipe],
    templateUrl: './table-row.component.html',
})
export class TableRowComponent {
    // Inputs
    candidature = input.required<Candidature>();
    visibleColumns = input<string[]>([]);
    editingCell = input<{ candidatureId: number; field: string } | null>(null);
    activeDropdown = input<{ candidatureId: number; field: string } | null>(null);
    hoveredScore = input<{ candidatureId: number; score: number } | null>(null);

    // Outputs
    edit = output<{ field: string; value: unknown }>();
    delete = output<void>();
    view = output<void>();
    archive = output<void>();
    startEdit = output<string>();
    cancelEdit = output<void>();
    toggleDropdown = output<string>();
    scoreHover = output<number>();
    scoreLeave = output<void>();

    // Données pour les dropdowns
    statuts = Object.values(StatutCandidature);
    priorites = Object.values(Priorite);
    typesContrat = Object.values(TypeContrat);

    // Fonctions utilitaires
    getStatutLabel = getStatutLabel;
    getPrioriteLabel = getPrioriteLabel;
    getTypeContratLabel = getTypeContratLabel;

    // Vérifier si une colonne est visible
    isColumnVisible(columnKey: string): boolean {
        return this.visibleColumns().includes(columnKey);
    }

    // Vérifier si on est en mode édition
    isEditing(field: string): boolean {
        const editing = this.editingCell();
        return editing?.candidatureId === this.candidature().id && editing?.field === field;
    }

    // Vérifier si un dropdown est actif
    isDropdownActive(field: string): boolean {
        const active = this.activeDropdown();
        return active?.candidatureId === this.candidature().id && active?.field === field;
    }

    // Calculer le score affiché (avec hover)
    getDisplayScore(): number {
        const hovered = this.hoveredScore();
        if (hovered?.candidatureId === this.candidature().id) {
            return hovered.score;
        }
        return this.candidature().score || 0;
    }

    // Actions d'édition
    onStartEdit(field: string): void {
        this.startEdit.emit(field);
    }

    onSaveEdit(field: string, value: unknown): void {
        this.edit.emit({ field, value });
    }

    onCancelEdit(): void {
        this.cancelEdit.emit();
    }

    onToggleDropdown(field: string): void {
        this.toggleDropdown.emit(field);
    }

    // Actions de score
    onScoreHover(score: number): void {
        this.scoreHover.emit(score);
    }

    onScoreLeave(): void {
        this.scoreLeave.emit();
    }

    onScoreClick(score: number): void {
        this.onSaveEdit('score', score);
        this.scoreLeave.emit();
    }

    // Actions de ligne
    onDelete(): void {
        this.delete.emit();
    }

    onView(): void {
        this.view.emit();
    }

    onArchive(): void {
        this.archive.emit();
    }

    // Classes CSS pour les badges
    getStatutBadgeClass(statut: StatutCandidature): string {
        const classes: Record<StatutCandidature, string> = {
            [StatutCandidature.APPLIQUEE]: 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 shadow-sm',
            [StatutCandidature.ENTRETIEN_TELEPHONIQUE]: 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-700 shadow-sm',
            [StatutCandidature.ENTRETIEN_TECHNIQUE]: 'bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-700 shadow-sm',
            [StatutCandidature.ENTRETIEN_RH]: 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700 shadow-sm',
            [StatutCandidature.OFFRE]: 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700 shadow-sm',
            [StatutCandidature.REFUSEE]: 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700 shadow-sm',
            [StatutCandidature.SANS_REPONSE]: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 shadow-sm'
        };
        return classes[statut] || '';
    }

    getPrioriteBadgeClass(priorite: Priorite): string {
        const classes: Record<Priorite, string> = {
            [Priorite.BASSE]: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 shadow-sm',
            [Priorite.MOYENNE]: 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 shadow-sm',
            [Priorite.HAUTE]: 'bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-800/50 text-orange-900 dark:text-orange-100 border border-orange-400 dark:border-orange-700 shadow-sm font-bold'
        };
        return classes[priorite] || '';
    }

    getTypeContratBadgeClass(type: TypeContrat): string {
        const classes: Record<TypeContrat, string> = {
            [TypeContrat.CDI]: 'bg-gradient-to-r from-green-100 to-emerald-200 dark:from-green-900/50 dark:to-emerald-800/50 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-700 shadow-sm font-bold',
            [TypeContrat.CDD]: 'bg-gradient-to-r from-blue-100 to-cyan-200 dark:from-blue-900/50 dark:to-cyan-800/50 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 shadow-sm',
            [TypeContrat.INTERIM]: 'bg-gradient-to-r from-purple-100 to-fuchsia-200 dark:from-purple-900/50 dark:to-fuchsia-800/50 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-700 shadow-sm',
            [TypeContrat.STAGE]: 'bg-gradient-to-r from-orange-100 to-amber-200 dark:from-orange-900/50 dark:to-amber-800/50 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-700 shadow-sm',
            [TypeContrat.ALTERNANCE]: 'bg-gradient-to-r from-indigo-100 to-violet-200 dark:from-indigo-900/50 dark:to-violet-800/50 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700 shadow-sm',
            [TypeContrat.FREELANCE]: 'bg-gradient-to-r from-yellow-100 to-lime-200 dark:from-yellow-900/50 dark:to-lime-800/50 text-yellow-900 dark:text-yellow-100 border border-yellow-400 dark:border-yellow-700 shadow-sm'
        };
        return classes[type] || '';
    }

    // Safe wrappers pour valeurs optionnelles
    getTypeContratBadgeClassSafe(type?: TypeContrat): string {
        return type ? this.getTypeContratBadgeClass(type) : '';
    }

    getTypeContratLabelSafe(type?: TypeContrat): string {
        return type ? getTypeContratLabel(type) : '-';
    }

    getPrioriteBadgeClassSafe(priorite?: Priorite): string {
        return priorite ? this.getPrioriteBadgeClass(priorite) : '';
    }

    getPrioriteLabelSafe(priorite?: Priorite): string {
        return priorite ? getPrioriteLabel(priorite) : '-';
    }

    // Format de la date
    formatDate(date: Date | string): string {
        if (!date) return '-';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('fr-FR');
    }
}
