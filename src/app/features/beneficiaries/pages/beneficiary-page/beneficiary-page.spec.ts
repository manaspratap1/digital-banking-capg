import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryPage } from './beneficiary-page';

describe('BeneficiaryPage', () => {
  let component: BeneficiaryPage;
  let fixture: ComponentFixture<BeneficiaryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiaryPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficiaryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
