import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { Admin } from '../../services/admin';
import { AdminPage } from './admin-page';

describe('AdminPage', () => {
  let component: AdminPage;
  let fixture: ComponentFixture<AdminPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPage],
      providers: [
        {
          provide: Admin,
          useValue: {
            users: signal([]),
            accounts: signal([]),
            transactions: signal([]),
            selectedUser: signal(null),
            selectedAccounts: signal([]),
            selectedTransactions: signal([]),
            isModalOpen: signal(false),
            searchTerm: signal(''),
            usersCount: () => 0,
            accountsCount: () => 0,
            transactionsCount: () => 0,
            filteredUsers: () => [],
            loadUsers: () => undefined,
            loadAccounts: () => undefined,
            loadTransactions: () => undefined,
            openUserDetails: () => undefined,
            closeModal: () => undefined,
            creditSalary: () => ({ subscribe: () => undefined }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
