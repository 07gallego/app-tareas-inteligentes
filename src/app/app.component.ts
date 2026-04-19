import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {}

  ngOnInit() {
    if (!localStorage.getItem('users')) {
      const users = [
        {
          id: 1,
          username: 'Ander Gonzales',
          password: 'Ander@2024!'
        },
        {
          id: 2,
          username: 'Luis Potter',
          password: 'Luis#Potter23'
        },
        {
          id: 3,
          username: 'Sara Gallego',
          password: 'Sara$2026'
        }
      ];

      localStorage.setItem('users', JSON.stringify(users));
      console.log('Usuarios creados en LocalStorage 🧠');
    }
  }
}