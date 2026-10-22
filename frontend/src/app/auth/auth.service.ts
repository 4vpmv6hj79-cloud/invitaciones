import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type UserRole = 'organizer' | 'admin';

export interface SecurityQuestion {
  id: string;
  text: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = 'inv_token';
const USER_KEY = 'inv_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  // Estado reactivo de sesión.
  private readonly _user = signal<AuthUser | null>(this.loadUser());
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  register(
    email: string,
    password: string,
    name: string,
    securityQuestion: string,
    securityAnswer: string,
  ): Observable<AuthResult> {
    return this.http
      .post<AuthResult>(`${this.baseUrl}/register`, {
        email,
        password,
        name,
        securityQuestion,
        securityAnswer,
      })
      .pipe(tap((res) => this.store(res)));
  }

  login(email: string, password: string): Observable<AuthResult> {
    return this.http
      .post<AuthResult>(`${this.baseUrl}/login`, { email, password })
      .pipe(tap((res) => this.store(res)));
  }

  // Catálogo de preguntas de seguridad (para registro y recuperación).
  getSecurityQuestions(): Observable<SecurityQuestion[]> {
    return this.http.get<SecurityQuestion[]>(`${this.baseUrl}/security-questions`);
  }

  // Paso 1 del reset sin correo: obtener el id de pregunta asociado a un correo.
  getSecurityQuestionFor(email: string): Observable<{ questionId: string | null }> {
    return this.http.post<{ questionId: string | null }>(
      `${this.baseUrl}/security-question`,
      { email },
    );
  }

  // Paso 2 del reset sin correo: restablecer contraseña con la respuesta.
  securityReset(
    email: string,
    answer: string,
    password: string,
  ): Observable<{ ok: boolean; message: string }> {
    return this.http.post<{ ok: boolean; message: string }>(
      `${this.baseUrl}/security-reset`,
      { email, answer, password },
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private store(res: AuthResult): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this._user.set(res.user);
  }

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
