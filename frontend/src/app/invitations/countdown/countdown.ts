import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  signal,
} from '@angular/core';

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Cuenta regresiva hasta la fecha/hora del evento.
// Reutilizable en editor (preview), vista pública, vista por invitado y preview completa.
@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [],
  templateUrl: './countdown.html',
  styleUrl: './countdown.scss',
})
export class Countdown implements OnChanges, OnDestroy {
  // Fecha del evento en formato YYYY-MM-DD.
  @Input() date = '';
  // Hora del evento en formato HH:mm (opcional; por defecto 00:00).
  @Input() time = '';
  // Color de acento para los números (toma el primary de la invitación).
  @Input() accent = '#b8860b';
  // Color del texto de las etiquetas.
  @Input() muted = '#777';

  protected readonly remaining = signal<Remaining | null>(null);
  protected readonly finished = signal(false);

  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnChanges(): void {
    this.stop();
    if (!this.date) {
      this.remaining.set(null);
      return;
    }
    this.tick();
    // Actualiza cada segundo.
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private targetDate(): Date | null {
    if (!this.date) return null;
    const time = this.time || '00:00';
    // Se interpreta en la zona horaria local del dispositivo.
    const target = new Date(`${this.date}T${time}:00`);
    return isNaN(target.getTime()) ? null : target;
  }

  private tick(): void {
    const target = this.targetDate();
    if (!target) {
      this.remaining.set(null);
      return;
    }
    const diff = target.getTime() - Date.now();
    if (diff <= 0) {
      this.finished.set(true);
      this.remaining.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      this.stop();
      return;
    }
    this.finished.set(false);
    const totalSeconds = Math.floor(diff / 1000);
    this.remaining.set({
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    });
  }
}
