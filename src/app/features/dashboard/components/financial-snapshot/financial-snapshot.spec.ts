import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialSnapshot } from './financial-snapshot';

describe('FinancialSnapshot', () => {
  let component: FinancialSnapshot;
  let fixture: ComponentFixture<FinancialSnapshot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialSnapshot],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialSnapshot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
