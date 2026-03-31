import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task';
import { AuthService } from '../../services/auth';

interface Week {
  startDate: Date;
  endDate: Date;
  startLabel: string;
  endLabel: string;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TasksPage implements OnInit {

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedWeek = 0;
  username = '';
  weeks: Week[] = [];

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.username = user ? user.username : 'Usuario';
    this.generateWeeks();
    this.loadTasks();
  }

  generateWeeks() {
    const start = new Date(2025, 7, 12);
    for (let i = 0; i < 8; i++) {
      const startDate = new Date(start);
      startDate.setDate(start.getDate() + i * 7);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      this.weeks.push({
        startDate,
        endDate,
        startLabel: this.formatDate(startDate),
        endLabel: this.formatDate(endDate)
      });
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit' });
  }

  selectWeek(index: number) {
    this.selectedWeek = index;
    this.loadTasks();
  }

  loadTasks() {
    this.tasks = this.taskService.getTasks();
    const week = this.weeks[this.selectedWeek];
    this.filteredTasks = this.tasks.filter(t => {
      const date = new Date(t.createdAt);
      return date >= week.startDate && date <= week.endDate;
    });
  }

  getProgress(): number {
    if (this.tasks.length === 0) return 0;
    return Math.round((this.countByStatus('realizada') / this.tasks.length) * 100);
  }

  getDashOffset(): number {
    return 163 - (163 * this.getProgress() / 100);
  }

  countByStatus(status: string): number {
    return this.tasks.filter(t => t.status === status).length;
  }

cycleStatus(task: Task) {
  const next: Record<Task['status'], Task['status']> = {
    pendiente: 'en-curso',
    'en-curso': 'realizada',
    realizada: 'pendiente'
  };

  this.taskService.updateStatus(task.id, next[task.status]);
  this.loadTasks();
}

  async addTask() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva tarea',
      inputs: [
        { name: 'title', type: 'text', placeholder: 'Título de la tarea' },
        { name: 'estimatedTime', type: 'text', placeholder: 'Tiempo estimado ej: 1h 30min' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.title) {
              this.taskService.addTask(data.title, data.estimatedTime || '');
              this.loadTasks();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteTask(id: string) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar tarea?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.taskService.deleteTask(id);
            this.loadTasks();
          }
        }
      ]
    });
    await alert.present();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}