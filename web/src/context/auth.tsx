import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Loading from '../components/Loading';
import api from '../services/api';
import * as auth from '../services/auth';

interface PayloadLogin {
    email: string;
    password: string;
    remember_password: boolean;
}

interface User {
    firstName: string;
    lastName: string;
    birth_date: Date;
    email: string;
}

interface Orphanages {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    published: boolean;
}

interface AuthContextData {
    signed: boolean;
    user: User | null;
    token: string;
    loading: boolean;
    signIn(credentials: PayloadLogin): Promise<void>;
    signOut(): void;
    updateOrphanages(): void;
    pendingOrphanages: Array<Orphanages>,
    orphanages: Array<Orphanages>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) =>{
    const history = useHistory();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [pendingOrphanages, setPendingOrphanages] = useState<Orphanages[]>([]);
    const [orphanages, setOrphanages] = useState<Orphanages[]>([]);

    useEffect(()=>{
        async function loadStorageData(){
            const getUser = sessionStorage.getItem('@Auth:user') || localStorage.getItem('@Auth:user');
            const getToken =  sessionStorage.getItem('@Auth:token') || localStorage.getItem('@Auth:token');

            if(getUser && getToken) {
                api.defaults.headers['Authorization'] = `Bearer ${getToken}`;
                setUser(JSON.parse(getUser));
            }
            setLoading(false);
        }

        loadStorageData();
    }, []);

    function updateOrphanages(){
        try {
            api.get('orphanagesDashboard').then((response) =>{
                const { data } = response;
                const isPublished = data.filter((res: Orphanages)=> !res.published);
                const notPublished = data.filter((res: Orphanages)=> res.published);
                
                setOrphanages(notPublished);
                setPendingOrphanages(isPublished);

                setLoading(false);
            });
        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(!!user) {
            updateOrphanages();
        }
    }, [user]);

    async function signIn(credentials: PayloadLogin){
        const response = await auth.signIn(credentials);
        const { data } = response;
        setUser(data.user);

        api.defaults.headers['Authorization'] = `Bearer ${data.token}`;

        if(credentials.remember_password) {
            localStorage.setItem('@Auth:user', JSON.stringify(data.user));
            localStorage.setItem('@Auth:token', data.token);
        }else{
            sessionStorage.setItem('@Auth:user', JSON.stringify(data.user));
            sessionStorage.setItem('@Auth:token', data.token);
        }

        history.push('/dashboard');
    }

    function signOut(){
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);

        history.push('/login');
    }

    if(loading) {
        return <Loading />;
    }
    
    return(
        <AuthContext.Provider value={
            { 
                signed: !!user, 
                token: '', 
                loading, 
                user, 
                signIn, 
                signOut, 
                updateOrphanages,
                pendingOrphanages, 
                orphanages
            }
        }>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    const context = useContext(AuthContext);
    return context;
}