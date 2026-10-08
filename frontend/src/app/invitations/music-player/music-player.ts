import {
  Component,
  Input,
  OnChanges,
  signal,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { youtubeId } from '../youtube.util';

// Reproductor de música de fondo basado en un video de YouTube (audio).
// El iframe queda oculto; un botón flotante permite reproducir/pausar.
// Nota: los navegadores bloquean el autoplay con sonido, por eso el botón
// y la activación al primer toque en la pantalla.
@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [],
  templateUrl: './music-player.html',
  styleUrl: './music-player.scss',
})
export class MusicPlayer implements OnChanges {
  @Input() url = '';
  @Input() accent = '#b8860b';

  @ViewChild('frame') frame?: ElementRef<HTMLIFrameElement>;

  protected readonly playing = signal(false);
  protected embedUrl: SafeResourceUrl | null = null;
  private videoId = '';

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnChanges(): void {
    this.videoId = youtubeId(this.url);
    if (!this.videoId) {
      this.embedUrl = null;
      return;
    }
    // enablejsapi permite controlar el reproductor con postMessage.
    // Arranca en silencio-reproduciendo no es fiable; dejamos que el usuario inicie.
    const src =
      `https://www.youtube.com/embed/${this.videoId}` +
      `?enablejsapi=1&loop=1&playlist=${this.videoId}&controls=0&modestbranding=1&rel=0`;
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  protected hasMusic(): boolean {
    return !!this.videoId;
  }

  // Reproduce o pausa enviando comandos al iframe de YouTube.
  toggle(): void {
    const win = this.frame?.nativeElement?.contentWindow;
    if (!win) return;
    const command = this.playing() ? 'pauseVideo' : 'playVideo';
    win.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), '*');
    this.playing.set(!this.playing());
  }
}
