export interface LoginRequest {
  credential: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: string;
  name: string;
  username: string;
  email: string;
}
