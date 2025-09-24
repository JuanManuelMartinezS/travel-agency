import { User } from '../../user/models/user.model';

export interface Session {
  _id?: string;
  token: string;
  expiration: string;
  code2FA: string;
  user: User;
}
