import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { InvitationService } from '../invitation.service';
import { Invitation, UpdateInvitationPayload } from '../invitation.model';
import { OrderService } from '../../orders/order.service';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type PreviewMode = 'mobile' | 'desktop';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
})
export class Editor implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(InvitationService);
  private readonly orders = inject(OrderService);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);
  protected readonly saveState = signal<SaveState>('idle');
  protected readonly previewMode = signal<PreviewMode>('mobile');
  protected readonly publishing = signal(false);
  protected readonly publishError = signal(false);

  private invitationId = '';

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
    // Evento religioso (misa)
    religiousEnabled: [false],
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
      religiousEnabled: d.religiousEnabled ?? false,
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
        religiousEnabled: v.religiousEnabled,
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

  // Abre la vista previa completa (como la verán los invitados) en una pestaña nueva.
  // Guarda antes para que refleje los últimos cambios.
  openPreview(): void {
    this.save();
    window.open(`/vista-previa/${this.invitationId}`, '_blank');
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
    if (v.date) parts.push(v.date);
    if (v.time) {
      parts.push(v.endTime ? `${v.time} – ${v.endTime} h` : `${v.time} h`);
    }
    return parts.join(' · ');
  }
}
