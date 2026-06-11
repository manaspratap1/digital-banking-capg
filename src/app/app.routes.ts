import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

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
import { TransactionsEffects } from './features/transactions/store/transactions.effects';
import { transactionsReducer } from './features/transactions/store/transactions.reducer';
import { transactionsFeatureKey } from './features/transactions/store/transactions.state';

import { BeneficiaryPage } from './features/beneficiaries/pages/beneficiary-page/beneficiary-page';
import { NotificationPage } from './features/notifications/pages/notification-page/notification-page';
import { customerGuard } from './core/guards/customer-guard-guard';
import { RegisterPage } from './features/auth/pages/register-page/register-page';

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
    path: 'register',
    component: RegisterPage,
    canActivate: [guestGuard]
  },
  
  {
  path: '',
  component: MainLayout,
  canActivate: [authGuard],
  children: [

    {
      path: 'dashboard',
      component: DashboardPage,
      canActivate: [customerGuard]
    },

    {
      path: 'transactions',
      component: TransactionPage,
      canActivate: [customerGuard],
      providers: [
        provideState(
          transactionsFeatureKey,
          transactionsReducer
        ),
        provideEffects(
          TransactionsEffects
        )
      ]
    },

    {
      path: 'transfers',
      component: TransferPage,
      canActivate: [customerGuard]
    },

    {
      path: 'bills',
      component: BillPage,
      canActivate: [customerGuard]
    },

    {
      path: 'finance',
      component: FinancePage,
      canActivate: [customerGuard]
    },

    {
      path: 'admin',
      component: AdminPage,
      canActivate: [adminGuard]
    },
    {
      path: 'beneficiaries',
      component: BeneficiaryPage,
      canActivate: [customerGuard]
    },
    {
      path: 'notifications',
      component: NotificationPage,
      canActivate: [customerGuard]
    }
  ]
}

];
