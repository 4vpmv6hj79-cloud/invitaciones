import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { InvitationService } from '../invitation.service';
import { Invitation, UpdateInvitationPayload } from '../invitation.model';
import { OrderService } from '../../orders/order.service';
import { PALETTES, Palette } from '../palettes';
import { Countdown } from '../countdown/countdown';
import { MusicPlayer } from '../music-player/music-player';
import { formatTime12h, formatDateLong } from '../time-format';
import { normalizeMapsUrl } from '../maps-url';
import { TemplateTheme } from '../../catalog/template.model';
import { groupFont, groupScale, TypoGroup } from '../typography.util';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type PreviewMode = 'mobile' | 'desktop';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, Countdown, MusicPlayer],
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

  // Imágenes de ejemplo del código de vestimenta.
  protected readonly dressImages = signal<string[]>([]);
  protected readonly dressUploading = signal(false);
  protected readonly dressError = signal<string | null>(null);
  protected newDressUrl = '';
  protected readonly DRESS_MAX = 6;

  // Imágenes decorativas entre secciones.
  protected readonly sectionImages = signal<string[]>([]);
  protected readonly sectionUploading = signal(false);
  protected readonly sectionError = signal<string | null>(null);
  protected newSectionUrl = '';
  protected readonly SECTION_MAX = 6;

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
    galleryMosaic: [false],
    dressCode: [''],
    dressCodeNote: [''],
    giftInfo: [''],
    musicUrl: [''],
    rsvpMode: ['abierto'],
    rsvpCompanions: [1],
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
    // Tipografía avanzada (nivel 2). '' = usar la global; escala 1 = tamaño normal.
    titleFont: [''],
    titleScale: [1],
    namesFont: [''],
    namesScale: [1],
    dataFont: [''],
    dataScale: [1],
    messageFont: [''],
    messageScale: [1],
    sectionHeadingFont: [''],
    sectionScale: [1],
  });

  // Grupos de tipografía avanzada (nivel 2) para generar los controles.
  protected readonly typoGroups = [
    { key: 'title', label: 'Título principal', fontCtrl: 'titleFont', scaleCtrl: 'titleScale' },
    { key: 'names', label: 'Nombres', fontCtrl: 'namesFont', scaleCtrl: 'namesScale' },
    { key: 'data', label: 'Fecha, hora y lugar', fontCtrl: 'dataFont', scaleCtrl: 'dataScale' },
    { key: 'message', label: 'Mensaje', fontCtrl: 'messageFont', scaleCtrl: 'messageScale' },
    { key: 'section', label: 'Títulos de sección', fontCtrl: 'sectionHeadingFont', scaleCtrl: 'sectionScale' },
  ] as const;

  // Opciones de fuente para los selectores de tipografía avanzada.
  // '' significa "usar la tipografía general".
  protected readonly fontOptions = [
    { value: '', label: 'Automática' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Baloo 2', label: 'Baloo 2' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Nunito', label: 'Nunito' },
    { value: 'Great Vibes', label: 'Great Vibes (manuscrita)' },
    { value: 'Dancing Script', label: 'Dancing Script (manuscrita)' },
    { value: 'Parisienne', label: 'Parisienne (manuscrita)' },
    { value: 'Sacramento', label: 'Sacramento (manuscrita)' },
  ];

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
      galleryMosaic: d.galleryMosaic ?? false,
      dressCode: d.dressCode ?? '',
      dressCodeNote: d.dressCodeNote ?? '',
      giftInfo: d.giftInfo ?? '',
      musicUrl: d.musicUrl ?? '',
      rsvpMode: d.rsvpMode ?? 'abierto',
      rsvpCompanions: d.rsvpCompanions ?? 1,
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
      titleFont: c.titleFont ?? '',
      titleScale: c.titleScale ?? 1,
      namesFont: c.namesFont ?? '',
      namesScale: c.namesScale ?? 1,
      dataFont: c.dataFont ?? '',
      dataScale: c.dataScale ?? 1,
      messageFont: c.messageFont ?? '',
      messageScale: c.messageScale ?? 1,
      sectionHeadingFont: c.sectionHeadingFont ?? '',
      sectionScale: c.sectionScale ?? 1,
    });
    this.gallery.set(Array.isArray(d.galleryImages) ? [...d.galleryImages] : []);
    this.dressImages.set(Array.isArray(d.dressCodeImages) ? [...d.dressCodeImages] : []);
    this.sectionImages.set(Array.isArray(d.sectionImages) ? [...d.sectionImages] : []);
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
        galleryMosaic: v.galleryMosaic,
        dressCode: v.dressCode,
        dressCodeNote: v.dressCodeNote,
        dressCodeImages: this.dressImages(),
        giftInfo: v.giftInfo,
        musicUrl: v.musicUrl,
        sectionImages: this.sectionImages(),
        rsvpMode: v.rsvpMode as 'abierto' | 'cerrado',
        rsvpCompanions: Number(v.rsvpCompanions),
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
        titleFont: v.titleFont,
        titleScale: Number(v.titleScale),
        namesFont: v.namesFont,
        namesScale: Number(v.namesScale),
        dataFont: v.dataFont,
        dataScale: Number(v.dataScale),
        messageFont: v.messageFont,
        messageScale: Number(v.messageScale),
        sectionHeadingFont: v.sectionHeadingFont,
        sectionScale: Number(v.sectionScale),
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

  // --- Imágenes del código de vestimenta ---

  dressSrc(url: string): string {
    return this.service.fileUrl(url);
  }

  addDressUrl(): void {
    const url = this.newDressUrl.trim();
    if (!url) return;
    if (this.dressImages().length >= this.DRESS_MAX) {
      this.dressError.set(`Máximo ${this.DRESS_MAX} imágenes.`);
      return;
    }
    this.dressImages.update((list) => [...list, url]);
    this.newDressUrl = '';
    this.dressError.set(null);
    this.save();
  }

  onDressFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (this.dressImages().length >= this.DRESS_MAX) {
      this.dressError.set(`Máximo ${this.DRESS_MAX} imágenes.`);
      input.value = '';
      return;
    }
    this.dressUploading.set(true);
    this.dressError.set(null);
    this.service.uploadImage(this.invitationId, file).subscribe({
      next: (res) => {
        this.dressImages.update((list) => [...list, res.url]);
        this.dressUploading.set(false);
        this.save();
      },
      error: (e) => {
        this.dressUploading.set(false);
        this.dressError.set(e?.error?.message ?? 'No se pudo subir la imagen');
      },
    });
    input.value = '';
  }

  removeDressAt(index: number): void {
    this.dressImages.update((list) => list.filter((_, i) => i !== index));
    this.save();
  }

  // --- Imágenes decorativas entre secciones ---

  sectionSrc(url: string): string {
    return this.service.fileUrl(url);
  }

  addSectionUrl(): void {
    const url = this.newSectionUrl.trim();
    if (!url) return;
    if (this.sectionImages().length >= this.SECTION_MAX) {
      this.sectionError.set(`Máximo ${this.SECTION_MAX} imágenes.`);
      return;
    }
    this.sectionImages.update((list) => [...list, url]);
    this.newSectionUrl = '';
    this.sectionError.set(null);
    this.save();
  }

  onSectionFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (this.sectionImages().length >= this.SECTION_MAX) {
      this.sectionError.set(`Máximo ${this.SECTION_MAX} imágenes.`);
      input.value = '';
      return;
    }
    this.sectionUploading.set(true);
    this.sectionError.set(null);
    this.service.uploadImage(this.invitationId, file).subscribe({
      next: (res) => {
        this.sectionImages.update((list) => [...list, res.url]);
        this.sectionUploading.set(false);
        this.save();
      },
      error: (e) => {
        this.sectionUploading.set(false);
        this.sectionError.set(e?.error?.message ?? 'No se pudo subir la imagen');
      },
    });
    input.value = '';
  }

  removeSectionAt(index: number): void {
    this.sectionImages.update((list) => list.filter((_, i) => i !== index));
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

  // Texto de fecha/hora formateado para la previsualización.
  protected formattedWhen(): string {
    const v = this.value();
    const parts: string[] = [];
    if (v.date) parts.push(formatDateLong(v.date));
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

  // --- Tipografía por grupo para la preview ---
  // Construye el objeto theme a partir del formulario actual.
  private themeFromForm(): TemplateTheme {
    const v = this.value();
    return {
      headingFont: v.headingFont,
      bodyFont: v.bodyFont,
      titleFont: v.titleFont,
      titleScale: Number(v.titleScale),
      namesFont: v.namesFont,
      namesScale: Number(v.namesScale),
      dataFont: v.dataFont,
      dataScale: Number(v.dataScale),
      messageFont: v.messageFont,
      messageScale: Number(v.messageScale),
      sectionHeadingFont: v.sectionHeadingFont,
      sectionScale: Number(v.sectionScale),
    };
  }

  protected gFont(group: TypoGroup): string {
    return groupFont(this.themeFromForm(), group);
  }

  protected gScale(group: TypoGroup): number {
    return groupScale(this.themeFromForm(), group);
  }

  // Normaliza el enlace de ubicación para que siempre abra Google Maps.
  protected mapsHref(value: string | undefined): string {
    return normalizeMapsUrl(value);
  }
}
