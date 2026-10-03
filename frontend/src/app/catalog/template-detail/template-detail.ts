import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TemplateService } from '../template.service';
import { Template } from '../template.model';
import { InvitationService } from '../../invitations/invitation.service';

@Component({
  selector: 'app-template-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './template-detail.html',
  styleUrl: './template-detail.scss',
})
export class TemplateDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TemplateService);
  private readonly invitations = inject(InvitationService);

  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly template = signal<Template | null>(null);
  protected readonly creating = signal(false);
  protected readonly createError = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }
    this.service.getById(id).subscribe({
      next: (t) => {
        this.template.set(t);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  // Crea un borrador desde esta plantilla y abre el editor.
  customize(): void {
    const t = this.template();
    if (!t || this.creating()) return;
    this.creating.set(true);
    this.createError.set(false);
    this.invitations.createDraft({ templateId: t.id }).subscribe({
      next: (inv) => this.router.navigate(['/editor', inv.id]),
      error: () => {
        this.creating.set(false);
        this.createError.set(true);
      },
    });
  }
}
