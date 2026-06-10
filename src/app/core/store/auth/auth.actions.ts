import { createAction, props } from '@ngrx/store';

import { AuthState } from '../../../shared/models/auth-state.model';

export const loginSuccess =
  createAction(
    '[Auth] Login Success',
    props<{ state: AuthState }>()
  );

export const logout =
  createAction(
    '[Auth] Logout'
  );