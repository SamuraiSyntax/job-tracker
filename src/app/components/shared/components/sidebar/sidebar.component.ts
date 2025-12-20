import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ROUTES } from '@constants/app.constants';
import { MenuItem } from '@models/index';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  // Menu principal
  mainMenuItems: MenuItem[] = [
    {
      label: 'Tableau de bord',
      icon: 'fas fa-chart-line',
      route: ROUTES.DASHBOARD,
      description: 'Vue d\'ensemble de vos statistiques',
      exact: true
    },
    {
      label: 'Statistiques',
      icon: 'fas fa-chart-bar',
      route: '/stats',
      description: 'Analyses détaillées et graphiques'
    },
    {
      label: 'Mes candidatures',
      icon: 'fas fa-list',
      route: ROUTES.CANDIDATURES.LIST,
      description: 'Liste de toutes vos candidatures'
    }
  ];

  externalLinks: MenuItem[] = [
    {
      label: 'GitHub',
      icon: 'fab fa-github',
      href: 'https://github.com/SamuraiSyntax/job-tracker',
      target: '_blank',
      description: 'Code source du projet'
    }
  ];
}
