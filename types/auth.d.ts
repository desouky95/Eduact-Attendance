declare type AuthPayload = {
  identifier: string;
  password: string;
};

declare type AuthResponse = {
  token: string;
  user: User;
};

declare type User = {
  email: string;
  first_name: string;
  grants: Array<any>;
  length: 0;
  last_name: string;
  parent_id: number | null;
  username: string;
};
