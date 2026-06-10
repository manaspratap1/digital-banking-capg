import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState } from '../../../shared/models/auth-state.model';

export const selectAuthState =
  createFeatureSelector<AuthState>(
    'auth'
  );

export const selectIsLoggedIn =
  createSelector(
    selectAuthState,
    state => state.isLoggedIn
  );

export const selectRole =
  createSelector(
    selectAuthState,
    state => state.role
  );

export const selectCurrentUser =
  createSelector(
    selectAuthState,
    state => state
  );