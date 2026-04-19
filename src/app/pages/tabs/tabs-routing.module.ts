import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tasks',
        loadComponent: () => import('../tasks/tasks.page').then(m => m.TasksPage)
      },
      {
        path: 'calendar',
        loadComponent: () => import('../calendar/calendar.page').then(m => m.CalendarPage)
      },
      {
        path: 'stats', // 👈 AÑADIDO
        loadComponent: () => import('../stats/stats.page').then(m => m.StatsPage)
      },
      {
        path: 'settings',
        loadComponent: () => import('../settings/settings.page').then(m => m.SettingsPage)
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}