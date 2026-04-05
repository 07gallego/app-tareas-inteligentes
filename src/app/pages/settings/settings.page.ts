import { Component } from '@angular/core';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SettingsPage {

  username = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    const user = this.authService.getCurrentUser();
    this.username = user ? user.username : '';
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
      await this.showToast('La contraseña debe tener al menos 4 caracteres', 'warning');
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