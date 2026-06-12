import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';

import { authReducer } from '../../../core/store/auth/auth.reducer';
import { Finance } from './finance';

describe('Finance', () => {
  let service: Finance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideStore({
          auth: authReducer,
        }),
      ],
    });
    service = TestBed.inject(Finance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
