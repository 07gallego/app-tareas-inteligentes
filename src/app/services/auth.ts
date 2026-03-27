import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly SESSION_KEY = 'auth_session';

  private mockUser = {
    id: '1',
    username: 'admin',
    password: '1234'
  };

  login(username: string, password: string): boolean {
    if (
      username === this.mockUser.username &&
      password === this.mockUser.password
    ) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(this.mockUser));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.SESSION_KEY);
  }

  getCurrentUser() {
    const data = localStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }
}