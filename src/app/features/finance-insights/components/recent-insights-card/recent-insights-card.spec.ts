import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';

import { authReducer } from '../../../../core/store/auth/auth.reducer';
import { RecentInsightsCard } from './recent-insights-card';

describe('RecentInsightsCard', () => {
  let component: RecentInsightsCard;
  let fixture: ComponentFixture<RecentInsightsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentInsightsCard],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideStore({
          auth: authReducer,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentInsightsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
