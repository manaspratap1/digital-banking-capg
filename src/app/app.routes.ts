import { Routes } from '@angular/router';

import { LoginPage } from './features/auth/pages/login-page/login-page';
import { DashboardPage } from './features/dashboard/pages/dashboard-page/dashboard-page';
import { AdminPage } from './features/admin/pages/admin-page/admin-page';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { guestGuard } from './core/guards/guest-guard';
import { MainLayout } from './shared/components/main-layout/main-layout';
import { TransactionPage } from './features/transactions/pages/transaction-page/transaction-page';
import { BillPage } from './features/bills/pages/bill-page/bill-page';
import { FinancePage } from './features/finance-insights/pages/finance-page/finance-page';
import { TransferPage } from './features/transfers/pages/transfer-page/transfer-page';
import { NotificationPage } from './features/notifications/pages/notification-page/notification-page';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginPage,
    canActivate: [guestGuard]
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [

      {
        path: 'dashboard',
        component: DashboardPage
      },

      {
        path: 'transactions',
        component: TransactionPage
      },

      {
        path: 'transfers',
        component: TransferPage
      },

      {
        path: 'bills',
        component: BillPage
      },

      {
        path: 'finance',
        component: FinancePage
      },

      {
        path: 'notifications',
        component: NotificationPage
      },

      {
        path: 'admin',
        component: AdminPage,
        canActivate: [adminGuard]
      },

    ]
  }

];