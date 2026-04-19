import { Injectable } from '@angular/core';

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly SESSION_KEY = 'auth_session';
  private readonly USERS_KEY = 'smarttask_users';

  private readonly DEFAULT_USERS: User[] = [
    {
      id: 'user-sara',
      username: 'SaraGallego',
      password: this.hash('Sara123'),
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'user-anderson',
      username: 'AndersonGonzalez',
      password: this.hash('Anderson123'),
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'user-luis',
      username: 'LuisPoter',
      password: this.hash('Luis123'),
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ];

  // ─── Login ──────────────────────────────────────────────
  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(
      (u: User) => u.username.toLowerCase() === username.toLowerCase()
               && u.password === this.hash(password)
    );
    if (user) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify({
        id: user.id,
        username: user.username
      }));
      return true;
    }
    return false;
  }

  // ─── Registro ───────────────────────────────────────────
  register(username: string, password: string): { ok: boolean; msg: string } {
    if (!username?.trim() || !password?.trim()) {
      return { ok: false, msg: 'Usuario y contraseña son requeridos.' };
    }
    if (password.length < 4) {
      return { ok: false, msg: 'La contraseña debe tener al menos 4 caracteres.' };
    }

    const users = this.getUsers();
    const exists = users.find(
      (u: User) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (exists) {
      return { ok: false, msg: 'Ese nombre de usuario ya está en uso.' };
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: username.trim(),
      password: this.hash(password),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return { ok: true, msg: '¡Cuenta creada! Ya puedes ingresar.' };
  }

  // ─── Eliminar usuario ────────────────────────────────────
  deleteUser(userId: string): { ok: boolean; msg: string } {
    const current = this.getCurrentUser();

    if (current?.id === userId) {
      return { ok: false, msg: 'No puedes eliminar tu propia cuenta mientras estás activo.' };
    }

    const users = this.getUsers();
    const index = users.findIndex((u: User) => u.id === userId);

    if (index === -1) {
      return { ok: false, msg: 'Usuario no encontrado.' };
    }

    users.splice(index, 1);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return { ok: true, msg: 'Usuario eliminado correctamente.' };
  }

  // ─── Listar usuarios (sin contraseña) ───────────────────
  getPublicUsers(): { id: string; username: string; createdAt?: string }[] {
    return this.getUsers().map(({ id, username, createdAt }) => ({
      id, username, createdAt
    }));
  }

  // ─── Cambio de contraseña ────────────────────────────────
  changePassword(username: string, currentPassword: string, newPassword: string): boolean {
    const users = this.getUsers();
    const user = users.find(
      (u: User) => u.username === username && u.password === this.hash(currentPassword)
    );
    if (!user) return false;

    user.password = this.hash(newPassword);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    if (this.isLoggedIn()) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify({
        id: user.id,
        username: user.username
      }));
    }
    return true;
  }

  // ─── Sesión ─────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.SESSION_KEY);
  }

  getCurrentUser(): { id: string; username: string } | null {
    const data = localStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  // ─── Helpers ─────────────────────────────────────────────
  private getUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    if (data) return JSON.parse(data);

    // Primera vez: cargar usuarios por defecto
    localStorage.setItem(this.USERS_KEY, JSON.stringify(this.DEFAULT_USERS));
    return this.DEFAULT_USERS;
  }

  hash(str: string): string {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) ^ str.charCodeAt(i);
      h = h & h;
    }
    return (h >>> 0).toString(16);
  }
}