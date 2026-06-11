import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../features/notifications/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {

  authService = inject(AuthService);

  notificationService =
    inject(NotificationService);

  notificationCount = computed(
    () => this.notificationService.notifications().length
  );

  ngOnInit(): void {

    this.notificationService.load();

  }

  logout(): void {
    this.authService.logout();
  }

}