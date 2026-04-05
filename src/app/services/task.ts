import { Injectable } from '@angular/core';
import { AuthService } from './auth';

export interface Task {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  status: 'pendiente' | 'faltante' | 'realizada';
  createdAt: Date;
  priority: 'alta' | 'media' | 'baja';  // 👈 nuevo
  category: string;                       // 👈 nuevo
  time: string;                           // 👈 nuevo
}

@Injectable({ providedIn: 'root' })
export class TaskService {

  constructor(private authService: AuthService) {}

  private getKey(): string {
    const user = this.authService.getCurrentUser();
    return user ? `tasks_${user.username}` : 'tasks_guest';
  }

  getTasks(): Task[] {
    const data = localStorage.getItem(this.getKey());
    return data ? JSON.parse(data) : [];
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.getKey(), JSON.stringify(tasks));
  }

  addTask(
    title: string,
    estimatedTime: string,
    description: string,
    createdAt: Date,
    priority: 'alta' | 'media' | 'baja' = 'media',  // 👈 nuevo
    category: string = 'personal',                    // 👈 nuevo
    time: string = ''                                 // 👈 nuevo
  ): void {
    const tasks = this.getTasks();
    tasks.push({
      id: Date.now().toString(),
      title,
      description,
      estimatedTime,
      status: 'pendiente',
      createdAt,
      priority,  
      category,  
      time       
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