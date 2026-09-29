export type Role = "admin" | "teacher" | "student" | "parent";

export type AuthUser = {
    id: number;
    role: string;
    user_id: string;
    full_name: string;
    email?: string;
    phone?: string;
    grade_level?: number;
    must_change_password?: boolean;
    reg_year?: number;
    status: string;
    created_at?: string;
    updated_at?: string;
};

export type LoginResponseData = {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: AuthUser;
};

export type LoginApiResponse = {
    success: boolean;
    message: string;
    data: LoginResponseData;
};

export type LoginCredentials = {
    Username: string;
    password: string;
};

