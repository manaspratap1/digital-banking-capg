import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { AuthService } from '../../../../core/services/auth.service';
import { BillService } from '../../services/bill';
import { BillPage } from './bill-page';

describe('BillPage', () => {
  let component: BillPage;
  let fixture: ComponentFixture<BillPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillPage],
      providers: [
        provideRouter([]),
        {
          provide: BillService,
          useValue: {
            bills: signal([]),
            pendingBillsCount: () => 0,
            paidBillsCount: () => 0,
            totalPendingAmount: () => 0,
            loadBills: () => undefined,
            markAsPaid: () => ({ subscribe: () => undefined }),
            deleteBill: () => ({ subscribe: () => undefined }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            currentUser: () => ({
              userId: '1',
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BillPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
