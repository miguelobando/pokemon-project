export interface UserData {
    id: number;
    email: string;
    password: string;
    name: string;
    gender: string;
  }

  export type UserDataContext = {
    user: UserData | null;
    setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  }