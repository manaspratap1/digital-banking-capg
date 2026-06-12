import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { Admin } from './admin';

describe('Admin', () => {
  let service: Admin;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(Admin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
