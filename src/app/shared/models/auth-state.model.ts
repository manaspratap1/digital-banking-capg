import { Role } from "../enums/role.enum";

export interface AuthState {
  isLoggedIn: boolean;
  userId: string | number | null;
  role: Role | null;
}