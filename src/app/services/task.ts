import { Injectable } from '@angular/core';

export interface Task {
  id: string;
  title: string;
  description: string;
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

  addTask(title: string, description: string): void {
    const tasks = this.getTasks();
    tasks.push({
      id: Date.now().toString(),
      title,
      description,
      status: 'pendiente',
      createdAt: new Date()
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
}