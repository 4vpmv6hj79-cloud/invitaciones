import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { TicketService, ValidationResult } from '../ticket.service';

@Component({
  selector: 'app-validate',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './validate.html',
  styleUrl: './validate.scss',
})
export class Validate implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TicketService);

  // Elemento <video> donde se muestra la cámara (solo existe cuando escaneamos).
  private readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('video');

  protected tokenInput = '';
  protected readonly result = signal<ValidationResult | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly working = signal(false);
  protected readonly scanning = signal(false);

  private reader?: BrowserQRCodeReader;
  private controls?: IScannerControls;

  ngOnInit(): void {
    // Si viene en la ruta (desde el QR abierto directamente), inspecciona.
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.tokenInput = token;
      this.inspect();
    }
  }

  ngOnDestroy(): void {
    this.stopScan();
  }

  // --- Escaneo con cámara ---

  async startScan(): Promise<void> {
    this.error.set(null);
    this.result.set(null);
    this.scanning.set(true);

    // Espera a que el <video> esté en el DOM (lo renderiza @if scanning()).
    setTimeout(async () => {
      const video = this.videoRef()?.nativeElement;
      if (!video) {
        this.scanning.set(false);
        return;
      }
      try {
        this.reader = new BrowserQRCodeReader();
        this.controls = await this.reader.decodeFromVideoDevice(
          undefined,
          video,
          (res) => {
            if (res) {
              const token = this.extractToken(res.getText());
              if (token) {
                this.tokenInput = token;
                this.stopScan();
                this.inspect();
              }
            }
          },
        );
      } catch {
        this.scanning.set(false);
        this.error.set(
          'No se pudo abrir la cámara. Revisa los permisos o usa la entrada manual.',
        );
      }
    }, 0);
  }

  stopScan(): void {
    this.controls?.stop();
    this.controls = undefined;
    this.reader = undefined;
    this.scanning.set(false);
  }

  // Extrae el ticketToken de un contenido escaneado (URL /validar/:token o token suelto).
  private extractToken(text: string): string | null {
    const trimmed = text.trim();
    const match = trimmed.match(/\/validar\/([^/?#]+)/);
    if (match) return match[1];
    // Si el QR trae solo el token (sin URL), lo aceptamos tal cual.
    if (/^[a-f0-9]{20,}$/i.test(trimmed)) return trimmed;
    return null;
  }

  // --- Validación (reutiliza el backend existente) ---

  inspect(): void {
    const token = this.tokenInput.trim();
    if (!token) return;
    this.working.set(true);
    this.error.set(null);
    this.service.inspect(token).subscribe({
      next: (r) => {
        this.result.set(r);
        this.working.set(false);
      },
      error: (e) => this.fail(e),
    });
  }

  checkIn(): void {
    const token = this.tokenInput.trim();
    if (!token) return;
    this.working.set(true);
    this.error.set(null);
    this.service.checkIn(token).subscribe({
      next: (r) => {
        this.result.set(r);
        this.working.set(false);
      },
      error: (e) => this.fail(e),
    });
  }

  private fail(e: { status?: number; error?: { message?: string } }): void {
    this.working.set(false);
    this.result.set(null);
    if (e.status === 403) {
      this.error.set('No estás autorizado para validar en este evento.');
    } else if (e.status === 404) {
      this.error.set('Pase no encontrado.');
    } else if (e.status === 401) {
      this.error.set('Inicia sesión como personal de acceso.');
    } else {
      this.error.set(e.error?.message ?? 'No se pudo validar el pase.');
    }
  }

  reset(): void {
    this.tokenInput = '';
    this.result.set(null);
    this.error.set(null);
  }
}
