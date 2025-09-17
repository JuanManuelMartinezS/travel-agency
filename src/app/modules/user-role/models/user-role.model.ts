import { Role } from "../../role/models/role.model";
import { User } from "../../user/models/user.model";



export interface UserRole {
  _id?: string;
  user: User;
  role: Role;
}
