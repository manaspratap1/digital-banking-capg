import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { environment } from '../../../environment';

import { User } from '../../shared/models/user.model';
import { AuthState } from '../../shared/models/auth-state.model';

import { AUTH_STORAGE_KEY } from '../constants/auth.constant';

import { loginSuccess, logout as logoutAction } from '../store/auth/auth.actions';

import { selectAuthState } from '../store/auth/auth.selectors';
import { ApiService } from './api.service';
import { Role } from '../../shared/enums/role.enum';
import { Account } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private store = inject(Store);
  private api = inject(ApiService);

  private currentState: AuthState = {
    isLoggedIn: false,
    userId: null,
    name: null,
    role: null
  };

  constructor() {
    this.store
      .select(selectAuthState)
      .subscribe(state => {
        this.currentState = state;
      });
  }

  login( email: string, password: string ): Observable<boolean> {
    return this.http
      .get<User[]>(
        `${environment.apiUrl}/users?email=${email}&password=${password}`
      )
      .pipe(

        map(users => users[0]),

        tap(user => {

          if (!user) {
            return;
          }

          const state: AuthState = {
            isLoggedIn: true,
            userId: user.id,
            name: user.name,
            role: user.role
          };

          localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify(state)
          );

          this.store.dispatch(
            loginSuccess({ state })
          );

        }),

        map(user => !!user)

      );

  }

  logout(): void {

    localStorage.removeItem(
      AUTH_STORAGE_KEY
    );

    this.store.dispatch(
      logoutAction()
    );

    this.router.navigate([
      '/login'
    ]);

  }

  restoreSession(): void {

    const storedData =
      localStorage.getItem(
        AUTH_STORAGE_KEY
      );

    if (!storedData) {
      return;
    }

    const state: AuthState =
      JSON.parse(storedData);

    this.store.dispatch(
      loginSuccess({ state })
    );

  }

  isLoggedIn(): boolean {

    return this.currentState
      .isLoggedIn;

  }

  getRole() {

    return this.currentState
      .role;

  }

  currentUser() {

    return this.currentState;

  }

  register( name: string, email: string, password: string) {

    const userPayload = {
        name,
        email,
        password,
        role: Role.CUSTOMER
      };

      return this.api
        .create(
          'users',
          userPayload
        )
        .pipe(

          switchMap((user: any) => {

            const account: Account = {

              id: Date.now(),

              userId: user.id,

              accountNumber:
                `ACC${Date.now()}`,

              balance: 0,

              accountType: 'Savings'

            };

            return this.api.create(
              'accounts',
              account
            );

          })

        );

    }

}