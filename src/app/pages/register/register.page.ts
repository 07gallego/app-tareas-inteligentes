import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class RegisterPage {

  username = '';
  password = '';
  confirmPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async onRegister() {
    if (!this.username || !this.password || !this.confirmPassword) {
      await this.showAlert('Campos requeridos', 'Por favor completa todos los campos.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (this.password.length < 4) {
      await this.showAlert('Error', 'La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    const success = this.authService.register(this.username, this.password);

    if (success) {
      await this.showAlert('¡Listo!', 'Cuenta creada exitosamente.');
      this.router.navigate(['/login'], { replaceUrl: true });
    } else {
      await this.showAlert('Error', 'El usuario ya existe.');
    }
  }

  goToLogin() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}