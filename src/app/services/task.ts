import { Injectable } from '@angular/core';

export interface Task {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  status: 'pendiente' | 'en-curso' | 'realizada';
  createdAt: Date;
  week: string; // 🔥 NUEVO
}

@Injectable({ providedIn: 'root' })
export class TaskService {

  private readonly TASKS_KEY = 'tasks';

  // 📥 Obtener tareas
  getTasks(): Task[] {
    const data = localStorage.getItem(this.TASKS_KEY);
    return data ? JSON.parse(data) : [];
  }

  // 💾 Guardar tareas
  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  // ➕ Crear tarea
  addTask(title: string, estimatedTime: string): void {
    const tasks = this.getTasks();

    const today = new Date();
    const week = this.getWeek(today); // 🔥 calcular semana

    tasks.push({
      id: Date.now().toString(),
      title,
      description: '',
      estimatedTime,
      status: 'pendiente',
      createdAt: today,
      week
    });

    this.saveTasks(tasks);
  }

  // 🔄 Actualizar estado
  updateStatus(id: string, status: Task['status']): void {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === id);

    if (task) {
      task.status = status;
      this.saveTasks(tasks);
    }
  }

  // ❌ Eliminar tarea
  deleteTask(id: string): void {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  }

  // 📅 Obtener semana
  getWeek(date: Date): string {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const numberOfDays = Math.floor(
      (date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000)
    );
    const week = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);

    return `Semana ${week}`;
  }

  // 📊 Progreso por estado
  getProgress(status: Task['status']): number {
    switch (status) {
      case 'realizada':
        return 100;
      case 'en-curso':
        return 60;
      case 'pendiente':
        return 40;
      default:
        return 0;
    }
  }
}