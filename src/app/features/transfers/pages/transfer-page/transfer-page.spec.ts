import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferPage } from './transfer-page';

describe('TransferPage', () => {
  let component: TransferPage;
  let fixture: ComponentFixture<TransferPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
