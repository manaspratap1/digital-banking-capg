import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';

import { authReducer } from '../../../../core/store/auth/auth.reducer';
import { SpendingSummaryCard } from './spending-summary-card';

describe('SpendingSummaryCard', () => {
  let component: SpendingSummaryCard;
  let fixture: ComponentFixture<SpendingSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingSummaryCard],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideStore({
          auth: authReducer,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingSummaryCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
