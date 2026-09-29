
export type ApiUser = {
    id: number;
    role: string;
    user_id: string;
    full_name: string;
    email?: string;
    phone?: string;
    grade_level?: number;
    reg_year?: number;
    status: string;
    must_change_password?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type UserListResponse = {
    users: ApiUser[];
    total: number;
    page: number;
    limit: number;
};

export type CreateUserPayload = {
    full_name: string;
    Role: string;
    Email?: string;
    phone?: string;
    Grade?: number;
    [key: string]: unknown;
};