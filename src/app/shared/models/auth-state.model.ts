import { Role } from "../enums/role.enum";

export interface AuthState {
  isLoggedIn: boolean;
  userId: number | null;
  role: Role;
}