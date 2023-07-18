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
  id: number;
  uuid: string;
  phone_number: string;
  middle_name: string | null;
  gender: 'female' | 'male';
  profile_photo: string;
  birth_date: Date;
  email_verified: boolean;
  phone_verified: boolean;
};
