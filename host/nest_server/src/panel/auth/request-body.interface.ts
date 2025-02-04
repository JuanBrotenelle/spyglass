export interface RequestBody {
    login: string;
    password: string;
  }

  export interface RequestBodyChangePassword {
    login: string;
    password: string;
    newPassword: string;
  }