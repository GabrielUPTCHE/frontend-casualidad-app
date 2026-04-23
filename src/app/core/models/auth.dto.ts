export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface LoginResponseDTO {
  access_token: string;
  refresh_token: string;
  user: UserDTO;
}
