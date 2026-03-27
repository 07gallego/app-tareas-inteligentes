import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TasksPage } from './tasks.page';

@NgModule({
  imports: [
    TasksPage,
    RouterModule.forChild([{ path: '', component: TasksPage }])
  ]
})
export class TasksPageModule {}