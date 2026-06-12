import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';

import { authReducer } from '../../../../core/store/auth/auth.reducer';
import { BillForm } from './bill-form';

describe('BillForm', () => {
  let component: BillForm;
  let fixture: ComponentFixture<BillForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillForm],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideStore({
          auth: authReducer,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BillForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
