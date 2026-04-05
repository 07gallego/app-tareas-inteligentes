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
    const users = this.getUsers();
    const user = users.find((u: any) => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
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

  register(username: string, password: string): boolean {
    const users = this.getUsers();
    const exists = users.find(u => u.username === username);
    if (exists) return false;
    users.push({ id: Date.now().toString(), username, password });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  private getUsers(): any[] {
    const data = localStorage.getItem('users');
    let users = data ? JSON.parse(data) : [];

    // 👇 Si no hay usuarios guardados, guarda el mockUser en localStorage
    if (users.length === 0) {
      users.push(this.mockUser);
      localStorage.setItem('users', JSON.stringify(users)); 
    }

    return users;
  }
}