import { AuthState } from '../../../shared/models/auth-state.model';

export const initialAuthState: AuthState = {
  isLoggedIn: false,
  userId: null,
  name: null,
  role: null
};