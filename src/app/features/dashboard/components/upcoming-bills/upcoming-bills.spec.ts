import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';

import { authReducer } from '../../../../core/store/auth/auth.reducer';
import { UpcomingBills } from './upcoming-bills';

describe('UpcomingBills', () => {
  let component: UpcomingBills;
  let fixture: ComponentFixture<UpcomingBills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingBills],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideStore({
          auth: authReducer,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingBills);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
