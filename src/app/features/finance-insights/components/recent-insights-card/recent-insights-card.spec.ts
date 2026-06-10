import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentInsightsCard } from './recent-insights-card';

describe('RecentInsightsCard', () => {
  let component: RecentInsightsCard;
  let fixture: ComponentFixture<RecentInsightsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentInsightsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentInsightsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
