import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  template: `
    <ion-content class="ion-padding">
      <h2>Calendario</h2>
      <p>Aquí iran las tareas</p>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CalendarPage {}