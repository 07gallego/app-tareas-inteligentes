import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StatsPage } from './stats.page';

@NgModule({
  imports: [
    StatsPage,
    RouterModule.forChild([{ path: '', component: StatsPage }])
  ]
})
export class StatsPageModule {}