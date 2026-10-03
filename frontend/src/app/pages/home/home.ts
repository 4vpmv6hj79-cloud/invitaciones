import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/auth.service';

interface HealthResponse {
  status: string;
  service: string;
  database: string;
  timestamp: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly auth = inject(AuthService);

  // Estado del backend, para verificar la comunicación front-back en la Etapa 0.
  protected readonly backendStatus = signal<'checking' | 'ok' | 'error'>('checking');
  protected readonly health = signal<HealthResponse | null>(null);

  logout(): void {
    this.auth.logout();
  }

  ngOnInit(): void {
    this.http.get<HealthResponse>(`${environment.apiBaseUrl}/health`).subscribe({
      next: (res) => {
        this.health.set(res);
        this.backendStatus.set(res.status === 'ok' ? 'ok' : 'error');
      },
      error: () => this.backendStatus.set('error'),
    });
  }
}
