import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-actions',
  imports: [],
  templateUrl: './quick-actions.html',
  styleUrl: './quick-actions.scss',
})
export class QuickActions {

  private router = inject(Router);

  goToTransfers() {
    this.router.navigate(['/transfers']);
  }

  goToBills() {
    this.router.navigate(['/bills']);
  }

  goToFinance() {
    this.router.navigate(['/finance']);
  }

}