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

  // Estado del backend (health check silencioso; solo se avisa si falla).
  protected readonly backendStatus = signal<'checking' | 'ok' | 'error'>('checking');
  protected readonly health = signal<HealthResponse | null>(null);

  // Tipos de evento para la sección de la landing.
  protected readonly eventTypes = [
    'Boda',
    'XV años',
    'Bautizo',
    'Baby shower',
    'Cumpleaños',
    'Aniversario',
    'Graduación',
    'Primera comunión',
    'Fiesta infantil',
    'Despedida',
  ];

  // Features destacadas de la plataforma.
  protected readonly features = [
    { icon: '✅', title: 'Confirmación de asistencia', desc: 'Tus invitados confirman con un toque y tú ves todo en tiempo real.' },
    { icon: '💬', title: 'Compartir por WhatsApp', desc: 'Envía a cada invitado su enlace personal directo a su chat.' },
    { icon: '📍', title: 'Ubicación con mapa', desc: 'Agrega la ubicación del evento y de la misa con Google Maps.' },
    { icon: '⏳', title: 'Cuenta regresiva', desc: 'Genera emoción con un contador hasta el gran día.' },
    { icon: '🖼️', title: 'Portada y galería', desc: 'Sube tus fotos favoritas para una invitación con tu sello.' },
    { icon: '🎟️', title: 'Boletos con QR', desc: 'Controla el acceso con pases y validación en la entrada.' },
  ];

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
