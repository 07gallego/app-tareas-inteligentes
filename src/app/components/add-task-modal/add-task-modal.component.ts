import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class AddTaskModalComponent implements OnInit {

  @Input() days: { label: string; dayNumber: number; date: Date }[] = [];
  @Input() editMode = false;   // 👈 nuevo
  @Input() taskData: any = null; // 👈 nuevo

  title = '';
  estimatedTime = '';
  description = '';
  selectedDayIndex = 0;
  priority: 'alta' | 'media' | 'baja' = 'media';
  category = 'personal';
  time = '';
  status: 'pendiente' | 'realizada' | 'faltante' = 'pendiente'; // 👈 nuevo

  hours: string[] = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, '0');
    return `${h}:00`;
  });

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.editMode && this.taskData) {
      this.title         = this.taskData.title || '';
      this.estimatedTime = this.taskData.estimatedTime || '';
      this.description   = this.taskData.description || '';
      this.priority      = this.taskData.priority || 'media';
      this.category      = this.taskData.category || 'personal';
      this.time          = this.taskData.time || '';
      this.status        = this.taskData.status || 'pendiente';

      const taskDate = new Date(this.taskData.createdAt);
      const idx = this.days.findIndex(d =>
        new Date(d.date).toDateString() === taskDate.toDateString()
      );
      this.selectedDayIndex = idx >= 0 ? idx : 0;
    }
  }

  confirm() {
    if (!this.title) return;

    this.modalCtrl.dismiss({
      title: this.title,
      estimatedTime: this.estimatedTime,
      description: this.description,
      date: this.days[this.selectedDayIndex].date,
      priority: this.priority,
      category: this.category,
      time: this.time,
      status: this.status  // 👈 nuevo
    });
  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }
}