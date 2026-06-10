import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { environment } from '../../../environment';

import { User } from '../../shared/models/user.model';
import { AuthState } from '../../shared/models/auth-state.model';

import { AUTH_STORAGE_KEY } from '../constants/auth.constant';

import { loginSuccess, logout as logoutAction } from '../store/auth/auth.actions';

import { selectAuthState } from '../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private store = inject(Store);

  private currentState: AuthState = {
    isLoggedIn: false,
    userId: null,
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

}