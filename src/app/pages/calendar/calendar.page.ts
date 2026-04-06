import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CalendarPage implements OnInit {

  today = new Date();
  currentYear = this.today.getFullYear();
  currentMonth = this.today.getMonth();
  selectedDate: Date | null = null;
  calendarDays: (Date | null)[] = [];
  tasksOfDay: Task[] = [];
  allTasks: Task[] = [];

  monthNames = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];

  dayNames = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.allTasks = this.taskService.getTasks();
    this.generateCalendar();
    this.selectDate(this.today);
  }

  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay  = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Offset: Monday = 0
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    for (let i = 0; i < startOffset; i++) {
      this.calendarDays.push(null);
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      this.calendarDays.push(new Date(this.currentYear, this.currentMonth, d));
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.tasksOfDay = this.allTasks.filter(t => {
      const d = new Date(t.createdAt);
      return d.toDateString() === date.toDateString();
    });
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    return date.toDateString() === this.today.toDateString();
  }

  isSelected(date: Date | null): boolean {
    if (!date || !this.selectedDate) return false;
    return date.toDateString() === this.selectedDate.toDateString();
  }

  hasTask(date: Date | null): boolean {
    if (!date) return false;
    return this.allTasks.some(t => {
      const d = new Date(t.createdAt);
      return d.toDateString() === date.toDateString();
    });
  }

  getStatusColor(status: string): string {
    if (status === 'realizada') return '#4CAF50';
    if (status === 'faltante')  return '#F44336';
    return '#FFC107';
  }
}