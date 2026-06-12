import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';

import { authReducer } from '../../../../core/store/auth/auth.reducer';
import { FinancialSnapshot } from './financial-snapshot';

describe('FinancialSnapshot', () => {
  let component: FinancialSnapshot;
  let fixture: ComponentFixture<FinancialSnapshot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialSnapshot],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideStore({
          auth: authReducer,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialSnapshot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
