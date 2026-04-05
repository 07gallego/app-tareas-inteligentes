import { Component, Input } from '@angular/core';
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
export class AddTaskModalComponent {

  @Input() days: { label: string; dayNumber: number; date: Date }[] = [];

  title = '';
  estimatedTime = '';
  description = '';
  selectedDayIndex = 0;
  priority: 'alta' | 'media' | 'baja' = 'media';
  category = 'personal';
  time = '';

  hours: string[] = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, '0');
    return `${h}:00`;
  });  

  constructor(private modalCtrl: ModalController) {}

  confirm() {
    if (!this.title) return;

    this.modalCtrl.dismiss({
      title: this.title,
      estimatedTime: this.estimatedTime,
      description: this.description,
      date: this.days[this.selectedDayIndex].date,
      priority: this.priority,
      category: this.category,
      time: this.time
    });
  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }
}