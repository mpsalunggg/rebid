export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export type LoginResponseData = {
  token: string;
  user: User;
};
