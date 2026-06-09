import { inject, Injectable, signal } from '@angular/core';
import { AuthState } from '../../shared/models/auth-state.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environment';
import { AUTH_STORAGE_KEY } from '../constants/auth.constant';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);

  private authState = signal<AuthState>({
    isLoggedIn: false,
    userId: null,
    role: null
  });

  readonly state = this.authState.asReadonly();

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${environment.apiUrl}/users?email=${email}&password=${password}`)
               .pipe(
                  map(users => users[0]),
                  tap(user => {
                    if(!user){
                      return;
                    }
                    
                    const state: AuthState = {
                      isLoggedIn: true,
                      userId: user.id,
                      role: user.role
                    };

                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
                    
                    this.authState.set(state);
                  }),
                  map(user => !!user)
                );
  }

  logout(): void {

    localStorage.removeItem(AUTH_STORAGE_KEY);

    this.authState.set({
      isLoggedIn: false,
      userId: null,
      role: null
    });

    this.router.navigate(['/login']);
  }

  restoreSession(): void {

    const storedData = localStorage.getItem(
      AUTH_STORAGE_KEY
    );

    if (!storedData) {
      return;
    }

    const state: AuthState =
      JSON.parse(storedData);

    this.authState.set(state);
  }

  isLoggedIn(): boolean {
    return this.authState().isLoggedIn;
  }

  getRole() {
    return this.authState().role;
  }

  currentUser() {
    return this.authState();
  }
}
