export type User = {
    id?: number,
    name?:string;
    phone?:string,
    role?:string,
    address?: string;
}
export type AuthState = {
    user:User | null;
    token: string | null;
    isAuthenticated : boolean;
    isLoading: boolean;
    error: string | null;
}
export type LoginCredentials = {
    phone: string;
    password: string;
}
export type SignUpCredentials = {
    name: string;
    phone:string;
    password:string;
    confirmPassword:string;
    role:number;
}