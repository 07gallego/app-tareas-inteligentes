import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AlertController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class LoginPage {

  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async onLogin() {
  console.log('1. username:', this.username);
  console.log('2. password:', this.password);

  if (!this.username || !this.password) {
    await this.showAlert('Campos requeridos', 'Por favor completa usuario y contraseña.');
    return;
  }

  const success = this.authService.login(this.username, this.password);
  console.log('3. login result:', success);

  if (success) {
    this.router.navigate(['/tabs/tasks'], { replaceUrl: true });
  } else {
    await this.showAlert('Error', 'Usuario o contraseña incorrectos.');
  }
}

  goToRegister() {
    this.router.navigate(['/register']);
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