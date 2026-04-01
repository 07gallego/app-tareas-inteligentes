import { Injectable } from '@angular/core';

export interface Task {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  status: 'pendiente' | 'faltante' | 'realizada';
  createdAt: Date;
}

@Injectable({ providedIn: 'root' })
export class TaskService {

  private readonly TASKS_KEY = 'tasks';

  getTasks(): Task[] {
    const data = localStorage.getItem(this.TASKS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  addTask(
  title: string,
  estimatedTime: string,
  description: string,
  createdAt: Date
): void {

  const tasks = this.getTasks();

  tasks.push({
    id: Date.now().toString(),
    title,
    description, // ✅ ahora sí guarda descripción
    estimatedTime,
    status: 'pendiente',
    createdAt 
  });

  this.saveTasks(tasks);
}

  updateStatus(id: string, status: Task['status']): void {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.status = status;
      this.saveTasks(tasks);
    }
  }

  deleteTask(id: string): void {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  }

  getProgress(status: Task['status']): number {
    switch (status) {
      case 'realizada': return 100;
      case 'pendiente': return 40;
      case 'faltante': return 0;
      default: return 0;
    }
  }
}