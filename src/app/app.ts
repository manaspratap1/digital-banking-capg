import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

import { DashboardPage } from './features/dashboard/pages/dashboard-page/dashboard-page';

@Component({
  selector: 'app-root',
  imports: [DashboardPage, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('digital-banking');

  private authService = inject(AuthService);

  constructor(){
    this.authService.restoreSession();
}
}
