export type UserRole = 'admin' | 'staff';

export interface AuthUser {
  readonly _id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly active?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface AuthResponse {
  readonly token: string;
  readonly user: AuthUser;
}

export interface CurrentUserResponse {
  readonly user: AuthUser;
}
