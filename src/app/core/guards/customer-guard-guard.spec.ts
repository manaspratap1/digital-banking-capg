import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { customerGuardGuard } from './customer-guard-guard';

describe('customerGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => customerGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
