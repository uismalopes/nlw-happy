import React, { FormEvent, useState } from 'react';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import SidebarRestricted from '../components/SidebarRestricted';
import { useAuth } from '../context/auth';

import '../styles/pages/login.css';

export default function Login(){
    const { signIn } = useAuth();

    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberPassword, setRememberPassword] = useState(false);

    async function handleSubmitForm(event: FormEvent){
        event.preventDefault();
        const credentials = {
            email, 
            password, 
            remember_password: rememberPassword
        };

        await signIn(credentials);
    }

    function handleGoBack(){
        history.push('/');
    }

    return(
        <div id="page-login">
            <SidebarRestricted />
            <div className="content-form">
                <button onClick={handleGoBack} className="goBack">
                    <FiArrowLeft size={25} color="#15C3D6" />
                </button>
                <form noValidate autoComplete="off" onSubmit={handleSubmitForm}>
                    <h1>Fazer login</h1>
                    <div className="input-block">
                        <label htmlFor="email">E-mail</label>
                        <input 
                        type="email" 
                        id="email" 
                        onChange={event => setEmail(event.target.value )} 
                        value={email}
                        required
                        />
                    </div>
                    <div className="input-block">
                        <label htmlFor="password">Senha</label>
                        <input 
                        type="password" 
                        id="password" 
                        onChange={event => setPassword(event.target.value )} 
                        value={password}
                        required
                        />
                    </div>

                    <div className="controller">
                        <div className="input-block">
                            <input 
                            type="checkbox" 
                            id="remember-password"
                            onChange={()=> setRememberPassword(!rememberPassword)} 
                            />
                            <label htmlFor="remember-password">
                                {
                                    rememberPassword &&(
                                    <span>
                                        <FiCheck size={18} color="#fff" />
                                    </span>
                                    )
                                }
                                Lembrar-me
                            </label>
                        </div>
                        <Link to="">
                            Esqueci minha senha
                        </Link>
                    </div>
                    <button type="submit" className="btn-submit">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}