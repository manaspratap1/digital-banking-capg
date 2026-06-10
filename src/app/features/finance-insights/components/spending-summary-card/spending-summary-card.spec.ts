import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingSummaryCard } from './spending-summary-card';

describe('SpendingSummaryCard', () => {
  let component: SpendingSummaryCard;
  let fixture: ComponentFixture<SpendingSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingSummaryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingSummaryCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
