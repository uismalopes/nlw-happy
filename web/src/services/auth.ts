import api from "./api"

interface PropsCredentials {
    email: string;
    password: string;
}

interface Response {
    data: {
        token: string;
        user: {
            firstName: string;
            lastName: string;
            birth_date: Date;
            email: string;
        }
    }
}

export const signIn = async (credentials: PropsCredentials): Promise<Response>=>{
    return api.post('auth', credentials);
}