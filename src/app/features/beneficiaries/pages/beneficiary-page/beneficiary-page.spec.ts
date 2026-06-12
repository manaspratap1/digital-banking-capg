import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { BeneficiaryPage } from './beneficiary-page';

describe('BeneficiaryPage', () => {
  let component: BeneficiaryPage;
  let fixture: ComponentFixture<BeneficiaryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiaryPage],
      providers: [
        provideRouter([]),
        {
          provide: ApiService,
          useValue: {
            get: () => of([]),
            create: () => of({}),
            delete: () => of({}),
          },
        },
        {
          provide: AuthService,
          useValue: {
            currentUser: () => ({
              userId: '1',
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficiaryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
