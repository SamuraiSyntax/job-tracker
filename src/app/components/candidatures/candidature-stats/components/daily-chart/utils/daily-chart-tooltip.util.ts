import { STATUS_COLORS, STATUS_LABELS, STATUS_ICONS } from '@constants/daily-chart.constants';

/**
 * Génère le HTML d'une carte de candidature pour le tooltip
 */
import { Candidature } from '@models/index';

export function generateCandidatureCardHTML(cand: Candidature, index: number, isDark: boolean): string {
    const color = STATUS_COLORS[cand.statut] || '#64748b';
    const label = STATUS_LABELS[cand.statut] || cand.statut;
    const icon = STATUS_ICONS[cand.statut] || 'fa-briefcase';
    const textColor = isDark ? '#f3f4f6' : '#111827';
    const subtextColor = isDark ? '#9ca3af' : '#6b7280';

    return `
        <div id="cand-card-${index}" class="antialiased" style="
          background: linear-gradient(to right, ${color}08, transparent);
          border-left: 3px solid ${color};
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid ${color}30;
        " onmouseover="
          this.style.background='linear-gradient(to right, ${color}15, transparent)';
          this.style.transform='translateX(4px)';
          this.style.boxShadow='0 4px 6px -1px rgba(0,0,0,0.1)';
        " onmouseout="
          this.style.background='linear-gradient(to right, ${color}08, transparent)';
          this.style.transform='translateX(0)';
          this.style.boxShadow='none';
        ">
          <div style="display: flex; justify-content: space-between; align-items: start; gap: 10px;">
            <div style="flex: 1; min-width: 0;">
              <div style="font-weight: 700; font-size: 13px; color: ${textColor}; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                <i class="fas fa-building" style="font-size: 11px; color: ${color};"></i>
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${cand.entreprise}</span>
              </div>
              <div style="font-size: 11px; color: ${subtextColor}; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                <i class="fas fa-briefcase" style="font-size: 10px;"></i>
                ${cand.poste}
              </div>
              <div style="display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 12px; background-color: ${color}; font-size: 10px; font-weight: 600; color: white;">
                <i class="fas ${icon}" style="font-size: 9px;"></i>
                ${label}
              </div>
            </div>
            <button onclick="window.navigateToCandidature(${cand.id}); event.stopPropagation();" style="
              background: ${color};
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              white-space: nowrap;
              box-shadow: 0 2px 4px ${color}40;
            " onmouseover="
              this.style.transform='scale(1.05)';
              this.style.boxShadow='0 4px 8px ${color}60';
            " onmouseout="
              this.style.transform='scale(1)';
              this.style.boxShadow='0 2px 4px ${color}40';
            ">
              <i class="fas fa-eye" style="margin-right: 4px;"></i>
              Voir
            </button>
          </div>
        </div>`;
}

/**
 * Génère le HTML d'un badge de statistique pour le tooltip
 */
export function generateStatBadgeHTML(label: string, value: number, color: string, isDark: boolean): string {
    const bgColor = isDark ? '#1f2937' : 'white';
    const borderColor = isDark ? '#374151' : '#e5e7eb';
    const labelColor = isDark ? '#9ca3af' : '#6b7280';
    const valueColor = isDark ? '#f3f4f6' : '#111827';

    return `
        <div style="display: flex; align-items: center; gap: 6px; background: ${bgColor}; padding: 6px 8px; border-radius: 6px; border: 1px solid ${borderColor};">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; box-shadow: 0 0 0 2px ${color}20;"></span>
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 10px; color: ${labelColor}; font-weight: 500;">${label}</div>
            <div style="font-size: 14px; font-weight: 700; color: ${valueColor};">${value}</div>
          </div>
        </div>`;
}

/**
 * Génère le HTML complet du tooltip pour un jour donné
 */
export interface TooltipStatParam {
  seriesName: string;
  value: number;
  color: string;
}

export function generateTooltipHTML(
  date: string,
  params: TooltipStatParam[],
  candidatures: Candidature[],
  isLocked = false,
  isDark = false
): string {
    const lockIcon = isLocked
        ? '<i class="fas fa-lock" style="color: #22c55e; font-size: 12px;"></i>'
        : '<i class="fas fa-lock" style="color: #9ca3af; font-size: 11px;"></i>';
    
    const statsBg = isDark ? '#111827' : '#f9fafb';
    const listBg = isDark ? '#1f2937' : 'white';
    const listTextColor = isDark ? '#9ca3af' : '#6b7280';

    let html = `
        <div style="min-width: 320px; max-width: 400px; font-family: 'Inter', sans-serif;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px 16px; border-radius: 8px 8px 0 0;">
            <div style="font-weight: 700; font-size: 15px; color: white; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-calendar-day" style="font-size: 14px;"></i>
                ${date}
              </div>
              <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; opacity: 0.9;">
                ${lockIcon}
              </div>
            </div>
          </div>
          
          <!-- Stats Section -->
          <div style="padding: 12px 16px; background-color: ${statsBg};">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">`;

    // Ajouter les statistiques
    const visibleStats = params.filter((item) => item.value > 0);
    visibleStats.forEach((item) => {
      html += generateStatBadgeHTML(item.seriesName, item.value, item.color, isDark);
    });

    html += `
            </div>
          </div>`;

    // Ajouter la liste des candidatures
    if (candidatures && candidatures.length > 0) {
        html += `
          <!-- Candidatures List -->
          <div style="padding: 12px 16px; max-height: 280px; overflow-y: auto; background: ${listBg};">
            <div style="font-weight: 600; font-size: 12px; color: ${listTextColor}; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
              <i class="fas fa-briefcase" style="margin-right: 6px;"></i>
              Candidatures (${candidatures.length})
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">`;

        candidatures.forEach((cand, index) => {
          html += generateCandidatureCardHTML(cand, index, isDark);
        });

        html += `
            </div>
          </div>`;
    }

    html += `
        </div>`;

    return html;
}
