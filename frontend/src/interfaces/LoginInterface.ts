export interface LoginInterface {
    user: User
    token: string
  }
  
  export interface User {
    id: number
    email: string
    password: string
    name: string
    gender: string
  }
  