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

  // 🔥 para expandir tareas
  expandedTaskId: string | null = null;

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
      return t.status === status && date >= week.startDate && date <= week.endDate;
    }).length;
  }

  // 🔥 expandir / cerrar tarea
  toggleTask(task: Task) {
    this.expandedTaskId = this.expandedTaskId === task.id ? null : task.id;
  }

  // 🔁 cambiar estado
  cycleStatus(task: Task) {
    const next: Record<Task['status'], Task['status']> = {
      pendiente: 'realizada',
      realizada: 'faltante',
      faltante: 'pendiente'
    };

    this.taskService.updateStatus(task.id, next[task.status]);
    this.loadTasks();
  }

  // Método para  agregar tarea con descripción
  async addTask() {
  const week = this.weeks[this.selectedWeek];
  const days = this.getDaysOfWeek(week);

  const alert = await this.alertCtrl.create({
    header: 'Nueva tarea',
    inputs: [
      { name: 'title', type: 'text' as const, placeholder: 'Título de la tarea' },
      { name: 'estimatedTime', type: 'text' as const, placeholder: 'Ej: 1h 30min' },
      { name: 'description', type: 'textarea' as const, placeholder: 'Descripción' },

      
      ...days.map((d, index) => ({
        name: 'day',
        type: 'radio' as const,
        label: `${d.label} ${d.dayNumber}`,
        value: index,
        checked: index === 0
      }))
    ],

    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Agregar',
        handler: (data) => {
          if (data.title) {

            const selectedDay = days[data.day];
            const taskDate = new Date(selectedDay.date);

            this.taskService.addTask(
              data.title,
              data.estimatedTime || '',
              data.description || '',
              taskDate
            );

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

}