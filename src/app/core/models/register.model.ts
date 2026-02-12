export interface RegisterRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}
