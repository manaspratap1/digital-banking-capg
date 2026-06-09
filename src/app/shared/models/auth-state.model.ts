export interface AuthState {
  isLoggedIn: boolean;
  userId: number | null;
  role: 'admin' | 'customer' | null;
}