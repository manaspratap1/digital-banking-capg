import { Role } from "../enums/role.enum";

export interface AuthState {
  isLoggedIn: boolean;
  userId: string | number | null;
  name: string | null;
  role: Role | null;
}