import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TransferPage } from './transfer-page';

describe('TransferPage', () => {
  let component: TransferPage;
  let fixture: ComponentFixture<TransferPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferPage],
      providers: [
        provideRouter([]),
        {
          provide: ApiService,
          useValue: {
            get: () => of([]),
            create: () => of({}),
            update: () => of({}),
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

    fixture = TestBed.createComponent(TransferPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
