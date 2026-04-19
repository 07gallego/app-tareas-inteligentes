import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task';
import { AuthService } from '../../services/auth';

interface WeekStat {
  label: string;
  total: number;
  realizadas: number;
  pendientes: number;
  faltantes: number;
  percent: number;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class StatsPage implements OnInit {

  username = '';
  tasks: Task[] = [];

  totalTasks = 0;
  totalRealizadas = 0;
  totalPendientes = 0;
  totalFaltantes = 0;
  globalPercent = 0;

  altaCount = 0;
  mediaCount = 0;
  bajaCount = 0;

  categorias: { name: string; count: number; color: string }[] = [];
  weekStats: WeekStat[] = [];

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.username = user ? user.username : '';
    this.tasks = this.taskService.getTasks();
    this.calcStats();
  }

  ionViewWillEnter() {
    this.tasks = this.taskService.getTasks();
    this.calcStats();
  }

  calcStats() {
    const tasks = this.tasks;
    this.totalTasks      = tasks.length;
    this.totalRealizadas = tasks.filter(t => t.status === 'realizada').length;
    this.totalPendientes = tasks.filter(t => t.status === 'pendiente').length;
    this.totalFaltantes  = tasks.filter(t => t.status === 'faltante').length;
    this.globalPercent   = this.totalTasks === 0 ? 0 :
      Math.round((this.totalRealizadas / this.totalTasks) * 100);

    this.altaCount  = tasks.filter(t => t.priority === 'alta').length;
    this.mediaCount = tasks.filter(t => t.priority === 'media').length;
    this.bajaCount  = tasks.filter(t => t.priority === 'baja').length;

    const catMap: Record<string, number> = {};
    tasks.forEach(t => {
      const cat = t.category || 'personal';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const colors = ['#534AB7','#7F77DD','#4CAF50','#FFC107','#F44336','#00BCD4'];
    this.categorias = Object.entries(catMap).map(([name, count], i) => ({
      name, count, color: colors[i % colors.length]
    })).sort((a, b) => b.count - a.count);

    this.weekStats = [];
    const today = new Date();
    const monday = new Date(today);
    const diff = today.getDay() === 0 ? -6 : 1 - today.getDay();
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 4; i++) {
      const start = new Date(monday);
      start.setDate(monday.getDate() + i * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      const weekTasks = tasks.filter(t => {
        const d = new Date(t.createdAt);
        return d >= start && d <= end;
      });

      const realizadas = weekTasks.filter(t => t.status === 'realizada').length;

      this.weekStats.push({
        label: `S${i + 1}`,
        total: weekTasks.length,
        realizadas,
        pendientes: weekTasks.filter(t => t.status === 'pendiente').length,
        faltantes:  weekTasks.filter(t => t.status === 'faltante').length,
        percent: weekTasks.length === 0 ? 0 :
          Math.round((realizadas / weekTasks.length) * 100)
      });
    }
  }

  getBarHeight(count: number): string {
    const max = Math.max(...this.weekStats.map(w => w.total), 1);
    return Math.round((count / max) * 80) + 'px';
  }

  getCatWidth(count: number): string {
    const max = Math.max(...this.categorias.map(c => c.count), 1);
    return Math.round((count / max) * 100) + '%';
  }

  getPriorityWidth(count: number): string {
    const max = Math.max(this.altaCount, this.mediaCount, this.bajaCount, 1);
    return Math.round((count / max) * 100) + '%';
  }
}