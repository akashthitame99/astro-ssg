export interface User {
    name: string;
    last_name: string
    id: number;
    address?: string;
    email: string;
    age?: number;
}

export interface SignIn {
    username: string
    password: string
}