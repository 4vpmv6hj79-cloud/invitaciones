import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DesignService, DesignRequest } from '../design.service';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-requests.html',
  styleUrl: './my-requests.scss',
})
export class MyRequests implements OnInit {
  protected readonly service = inject(DesignService);
  protected readonly loading = signal(true);
  protected readonly requests = signal<DesignRequest[]>([]);

  ngOnInit(): void {
    this.service.listMine().subscribe({
      next: (list) => {
        this.requests.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
