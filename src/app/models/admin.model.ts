export interface Admin {
  id?: string;
  username: string;
  password?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isSuper?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
