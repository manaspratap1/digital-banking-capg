import { Role } from "../enums/role.enum";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}