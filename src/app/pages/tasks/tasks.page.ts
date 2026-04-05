import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task';
import { AuthService } from '../../services/auth';
import { AddTaskModalComponent } from '../../components/add-task-modal/add-task-modal.component';

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
  expandedTaskId: string | null = null;
  today = new Date();

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.username = user ? user.username : 'Usuario';
    this.generateWeeks();
    this.loadTasks();
  }

  generateWeeks() {
    const today = new Date();
    const monday = new Date(today);
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 8; i++) {
      const startDate = new Date(monday);
      startDate.setDate(monday.getDate() + i * 7);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      this.weeks.push({
        startDate,
        endDate,
        startLabel: this.formatDate(startDate),
        endLabel: this.formatDate(endDate)
      });
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
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
    if (this.filteredTasks.length === 0) return 0;
    return Math.round(
      (this.filteredTasks.filter(t => t.status === 'realizada').length /
        this.filteredTasks.length) * 100
    );
  }

  getDashOffset(): number {
    return 163 - (163 * this.getProgress() / 100);
  }

  countByStatus(status: string): number {
    return this.filteredTasks.filter(t => t.status === status).length;
  }

  countByStatusAndWeek(weekIndex: number, status: string): number {
    const week = this.weeks[weekIndex];
    return this.taskService.getTasks().filter(t => {
      const date = new Date(t.createdAt);
      return t.status === status &&
             date >= week.startDate &&
             date <= week.endDate;
    }).length;
  }

  isToday(date: Date): boolean {
    return date.toDateString() === this.today.toDateString();
  }

  getDaysOfWeek(week: Week) {
    const days = [];
    const start = new Date(week.startDate);

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push({
        date: day,
        label: day.toLocaleDateString('es-CO', { weekday: 'short' }),
        dayNumber: day.getDate()
      });
    }

    return days;
  }

  getTasksByDay(date: Date) {
    return this.filteredTasks.filter(t => {
      const taskDate = new Date(t.createdAt);
      return taskDate.toDateString() === date.toDateString();
    });
  }

  hasStatusInDay(date: Date, status: string): boolean {
    return this.getTasksByDay(date).some(t => t.status === status);
  }

  toggleTask(task: Task) {
    this.expandedTaskId = this.expandedTaskId === task.id ? null : task.id;
  }

  cycleStatus(task: Task) {
    const next: Record<Task['status'], Task['status']> = {
      pendiente: 'realizada',
      realizada: 'faltante',
      faltante: 'pendiente'
    };
    this.taskService.updateStatus(task.id, next[task.status]);
    this.loadTasks();
  }

  async addTask() {
    const week = this.weeks[this.selectedWeek];
    const days = this.getDaysOfWeek(week);

    const modal = await this.modalCtrl.create({
      component: AddTaskModalComponent,
      componentProps: { days }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.taskService.addTask(
        data.title,
        data.estimatedTime || '',
        data.description || '',
        data.date,
        data.priority || 'media',     
        data.category || 'personal',  
        data.time || ''               
      );
      this.loadTasks();
    }
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

  async ListenerHeader() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Está seguro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'OK',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  isOverdue(task: Task): boolean {
  if (task.status === 'realizada') return false;
  const taskDate = new Date(task.createdAt);
  taskDate.setHours(23, 59, 59, 999);
  return taskDate < this.today;
}

}