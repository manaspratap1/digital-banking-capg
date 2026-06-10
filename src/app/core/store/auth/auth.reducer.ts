import {
  createReducer,
  on
} from '@ngrx/store';

import {
  loginSuccess,
  logout
} from './auth.actions';

import {
  initialAuthState
} from './auth.state';

export const authReducer =
  createReducer(

    initialAuthState,

    on(
      loginSuccess,
      (_, { state }) => state
    ),

    on(
      logout,
      () => initialAuthState
    )

  );