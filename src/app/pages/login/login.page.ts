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
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async onLogin() {
    if (!this.username?.trim() || !this.password?.trim()) {
      await this.showAlert('Campos requeridos', 'Por favor completa usuario y contraseña.');
      return;
    }

    this.isLoading = true;
    const success = this.authService.login(this.username.trim(), this.password);
    this.isLoading = false;

    if (success) {
      this.router.navigate(['/tabs/tasks'], { replaceUrl: true });
    } else {
      await this.showAlert('Error', 'Usuario o contraseña incorrectos.');
    }
  }

  async goToRegister() {
    // Registro rápido directo desde el login (sin navegar)
    const alert = await this.alertCtrl.create({
      header: 'Crear cuenta',
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Usuario',
          attributes: { autocomplete: 'off' }
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña (mín. 4 caracteres)'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Registrarme',
          handler: async (data) => {
            const result = this.authService.register(data.username, data.password);
            if (result.ok) {
              await this.showAlert('¡Listo!', result.msg);
            } else {
              await this.showAlert('No se pudo crear', result.msg);
              return false; // mantiene el alert abierto
            }
            return true;
          }
        }
      ]
    });
    await alert.present();
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