import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { InvitationService } from '../invitation.service';
import { Invitation, UpdateInvitationPayload } from '../invitation.model';
import { OrderService } from '../../orders/order.service';
import { PALETTES, Palette } from '../palettes';
import { Countdown } from '../countdown/countdown';
import { formatTime12h } from '../time-format';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type PreviewMode = 'mobile' | 'desktop';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, Countdown],
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
})
export class Editor implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(InvitationService);
  private readonly orders = inject(OrderService);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);
  protected readonly saveState = signal<SaveState>('idle');
  protected readonly previewMode = signal<PreviewMode>('mobile');
  protected readonly publishing = signal(false);
  protected readonly publishError = signal(false);
  protected readonly coverUploading = signal(false);
  protected readonly coverError = signal<string | null>(null);
  // Galería de fotos (lista dinámica, no es un form control simple).
  protected readonly gallery = signal<string[]>([]);
  protected readonly galleryUploading = signal(false);
  protected readonly galleryError = signal<string | null>(null);
  protected newGalleryUrl = '';
  protected readonly GALLERY_MAX = 12;

  private invitationId = '';

  // Paletas curadas disponibles en el selector.
  protected readonly palettes = PALETTES;

  // Formulario de contenido + personalización. Alimenta la vista previa en vivo.
  protected readonly form = this.fb.nonNullable.group({
    title: [''],
    coupleOrHonoree: [''],
    message: [''],
    date: [''],
    time: [''],
    endTime: [''],
    locationName: [''],
    mapsUrl: [''],
    showCountdown: [false],
    coverImageUrl: [''],
    coverStyle: ['banner'],
    coverSize: ['m'],
    coverWidthPct: [80],
    galleryItemPct: [31],
    // Evento religioso (misa)
    religiousEnabled: [false],
    religiousTitle: [''],
    religiousSameLocation: [true],
    religiousTime: [''],
    religiousLocationName: [''],
    religiousMapsUrl: [''],
    primary: ['#333333'],
    secondary: ['#666666'],
    background: ['#ffffff'],
    headingFont: ['serif'],
    bodyFont: ['sans-serif'],
  });

  // Señal con el valor actual del formulario, para la previsualización.
  protected readonly value = signal(this.form.getRawValue());

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }
    this.invitationId = id;

    this.service.getById(id).subscribe({
      next: (inv) => {
        this.patchFromInvitation(inv);
        this.loading.set(false);
        this.wireAutosave();
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }

  private patchFromInvitation(inv: Invitation): void {
    const c = inv.customization ?? {};
    const d = inv.event?.data ?? {};
    this.form.patchValue({
      title: inv.event?.title ?? '',
      coupleOrHonoree: d.coupleOrHonoree ?? '',
      message: d.message ?? '',
      date: d.date ?? '',
      time: d.time ?? '',
      endTime: d.endTime ?? '',
      locationName: d.locationName ?? '',
      mapsUrl: d.mapsUrl ?? '',
      showCountdown: d.showCountdown ?? false,
      coverImageUrl: d.coverImageUrl ?? '',
      coverStyle: d.coverStyle ?? 'banner',
      coverSize: d.coverSize ?? 'm',
      // Fallback: si no hay porcentaje guardado, lo derivamos del tamaño antiguo (s/m/l).
      coverWidthPct: d.coverWidthPct ?? this.sizeToPct(d.coverSize),
      galleryItemPct: d.galleryItemPct ?? 31,
      religiousEnabled: d.religiousEnabled ?? false,
      religiousTitle: d.religiousTitle ?? '',
      // (galleryImages se maneja en una signal aparte, no en el form)
      religiousSameLocation: d.religiousSameLocation ?? true,
      religiousTime: d.religiousTime ?? '',
      religiousLocationName: d.religiousLocationName ?? '',
      religiousMapsUrl: d.religiousMapsUrl ?? '',
      primary: c.primary ?? '#333333',
      secondary: c.secondary ?? '#666666',
      background: c.background ?? '#ffffff',
      headingFont: c.headingFont ?? 'serif',
      bodyFont: c.bodyFont ?? 'sans-serif',
    });
    this.gallery.set(Array.isArray(d.galleryImages) ? [...d.galleryImages] : []);
    this.value.set(this.form.getRawValue());
  }

  // Guardado automático con debounce al cambiar el formulario.
  private wireAutosave(): void {
    this.form.valueChanges.pipe(debounceTime(600)).subscribe(() => {
      this.value.set(this.form.getRawValue());
      this.save();
    });
    // Refresca la previsualización de inmediato (sin esperar al debounce).
    this.form.valueChanges.subscribe(() => this.value.set(this.form.getRawValue()));
  }

  save(): void {
    const v = this.form.getRawValue();
    // Si la misa es en el mismo lugar, no persistimos lugar/maps propios del evento religioso.
    const sameLoc = v.religiousEnabled && v.religiousSameLocation;
    const payload: UpdateInvitationPayload = {
      title: v.title,
      eventData: {
        coupleOrHonoree: v.coupleOrHonoree,
        message: v.message,
        date: v.date,
        time: v.time,
        endTime: v.endTime,
        locationName: v.locationName,
        mapsUrl: v.mapsUrl,
        showCountdown: v.showCountdown,
        coverImageUrl: v.coverImageUrl,
        coverStyle: v.coverStyle as 'banner' | 'fondo' | 'marco',
        coverSize: v.coverSize as 's' | 'm' | 'l',
        coverWidthPct: Number(v.coverWidthPct),
        galleryItemPct: Number(v.galleryItemPct),
        galleryImages: this.gallery(),
        religiousEnabled: v.religiousEnabled,
        religiousTitle: v.religiousEnabled ? v.religiousTitle : '',
        religiousSameLocation: v.religiousSameLocation,
        religiousTime: v.religiousEnabled ? v.religiousTime : '',
        religiousLocationName: sameLoc ? '' : v.religiousEnabled ? v.religiousLocationName : '',
        religiousMapsUrl: sameLoc ? '' : v.religiousEnabled ? v.religiousMapsUrl : '',
      },
      customization: {
        primary: v.primary,
        secondary: v.secondary,
        background: v.background,
        headingFont: v.headingFont,
        bodyFont: v.bodyFont,
      },
    };

    this.saveState.set('saving');
    this.service.update(this.invitationId, payload).subscribe({
      next: () => this.saveState.set('saved'),
      error: () => this.saveState.set('error'),
    });
  }

  setPreview(mode: PreviewMode): void {
    this.previewMode.set(mode);
  }

  // Sube la imagen de portada y guarda su URL en el formulario.
  onCoverFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.coverUploading.set(true);
    this.coverError.set(null);
    this.service.uploadImage(this.invitationId, file).subscribe({
      next: (res) => {
        this.form.patchValue({ coverImageUrl: res.url });
        this.coverUploading.set(false);
      },
      error: (e) => {
        this.coverUploading.set(false);
        this.coverError.set(e?.error?.message ?? 'No se pudo subir la imagen');
      },
    });
    input.value = '';
  }

  // Quita la portada.
  clearCover(): void {
    this.form.patchValue({ coverImageUrl: '' });
  }

  // Resuelve la URL de la portada para mostrarla (soporta /uploads y URLs).
  coverSrc(): string {
    return this.service.fileUrl(this.value().coverImageUrl || '');
  }

  // Convierte el tamaño antiguo (s/m/l) a un porcentaje de ancho.
  private sizeToPct(size: string | undefined): number {
    if (size === 's') return 55;
    if (size === 'l') return 100;
    return 80; // 'm' o indefinido
  }

  // Ancho de la portada en % para la preview.
  coverWidth(): string {
    return `${this.value().coverWidthPct || 80}%`;
  }

  // --- Galería ---

  // Resuelve una URL de la galería para mostrarla.
  gallerySrc(url: string): string {
    return this.service.fileUrl(url);
  }

  // Ancho de cada foto de galería en % para la preview.
  galleryItemWidth(): string {
    return `${this.value().galleryItemPct || 31}%`;
  }

  // Agrega una imagen por URL escrita manualmente.
  addGalleryUrl(): void {
    const url = this.newGalleryUrl.trim();
    if (!url) return;
    if (this.gallery().length >= this.GALLERY_MAX) {
      this.galleryError.set(`Máximo ${this.GALLERY_MAX} fotos.`);
      return;
    }
    this.gallery.update((list) => [...list, url]);
    this.newGalleryUrl = '';
    this.galleryError.set(null);
    this.save();
  }

  // Sube un archivo y lo agrega a la galería.
  onGalleryFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (this.gallery().length >= this.GALLERY_MAX) {
      this.galleryError.set(`Máximo ${this.GALLERY_MAX} fotos.`);
      input.value = '';
      return;
    }
    this.galleryUploading.set(true);
    this.galleryError.set(null);
    this.service.uploadImage(this.invitationId, file).subscribe({
      next: (res) => {
        this.gallery.update((list) => [...list, res.url]);
        this.galleryUploading.set(false);
        this.save();
      },
      error: (e) => {
        this.galleryUploading.set(false);
        this.galleryError.set(e?.error?.message ?? 'No se pudo subir la imagen');
      },
    });
    input.value = '';
  }

  // Quita una foto de la galería por índice.
  removeGalleryAt(index: number): void {
    this.gallery.update((list) => list.filter((_, i) => i !== index));
    this.save();
  }

  // Aplica una paleta curada: rellena colores y fuentes del formulario.
  // Dispara valueChanges, por lo que autosave y preview se actualizan solos.
  applyPalette(p: Palette): void {
    this.form.patchValue({
      primary: p.primary,
      secondary: p.secondary,
      background: p.background,
      headingFont: p.headingFont,
      bodyFont: p.bodyFont,
    });
  }

  // Indica si la paleta coincide con los colores actuales (para resaltar la seleccionada).
  isPaletteActive(p: Palette): boolean {
    const v = this.value();
    return (
      v.primary === p.primary &&
      v.secondary === p.secondary &&
      v.background === p.background
    );
  }

  // Abre la vista previa completa (como la verán los invitados) en la MISMA pestaña.
  // Guarda antes para que refleje los últimos cambios; desde la preview se vuelve al editor.
  openPreview(): void {
    this.save();
    this.router.navigate(['/vista-previa', this.invitationId]);
  }

  // Guarda y luego inicia el pago para publicar la invitación.
  publish(): void {
    if (this.publishing()) return;
    this.publishing.set(true);
    this.publishError.set(false);

    // Guarda el estado actual antes de cobrar.
    this.save();
    this.orders.createCheckout(this.invitationId).subscribe({
      next: (res) => {
        if (res.checkoutUrl) {
          // Stripe: redirige a la pasarela.
          window.location.href = res.checkoutUrl;
        } else {
          // Modo simulado: el pago ya quedó confirmado; vamos a la pantalla de éxito.
          window.location.href = `/pago/exito?order=${res.orderId}`;
        }
      },
      error: () => {
        this.publishing.set(false);
        this.publishError.set(true);
      },
    });
  }

  // Texto de fecha/hora formateado para la previsualización (12h con a.m./p.m.).
  protected formattedWhen(): string {
    const v = this.value();
    const parts: string[] = [];
    if (v.date) parts.push(v.date);
    if (v.time) {
      const start = formatTime12h(v.time);
      parts.push(v.endTime ? `${start} – ${formatTime12h(v.endTime)}` : start);
    }
    return parts.join(' · ');
  }

  // Hora en formato 12h para mostrar (ej. evento religioso).
  protected fmtTime(time: string | undefined): string {
    return formatTime12h(time);
  }

  // Título de la sección religiosa (personalizado o por defecto).
  protected religiousHeading(): string {
    return this.value().religiousTitle?.trim() || 'Evento religioso';
  }
}
