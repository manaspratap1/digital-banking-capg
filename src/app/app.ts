import { Component } from '@angular/core';
import { DashboardPage } from './features/dashboard/pages/dashboard-page/dashboard-page';

@Component({
  selector: 'app-root',
  imports: [DashboardPage],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}