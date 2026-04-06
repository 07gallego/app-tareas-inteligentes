import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TaskService, Task } from '../../services/task';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {

  username = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  tasks: Task[] = [];

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.username = user ? user.username : '';
    this.tasks = this.taskService.getTasks();
  }

  formatDate(date: any): string {
    return new Date(date).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }

  async changePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      await this.showToast('Completa todos los campos', 'warning');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      await this.showToast('Las contraseñas no coinciden', 'danger');
      return;
    }
    if (this.newPassword.length < 4) {
      await this.showToast('Mínimo 4 caracteres', 'warning');
      return;
    }
    const success = this.authService.changePassword(
      this.username,
      this.currentPassword,
      this.newPassword
    );
    if (success) {
      await this.showToast('Contraseña actualizada correctamente', 'success');
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } else {
      await this.showToast('Contraseña actual incorrecta', 'danger');
    }
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}