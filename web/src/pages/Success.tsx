import React from 'react';
import { Link } from 'react-router-dom';

import iconSuccess from '../images/icon-success.svg';
import '../styles/pages/success.css';

export default function Success(){
    return(
        <div id="page-success">
            <div className="grid-template">
                <div className="description">
                    <strong>Ebaaa!</strong>
                    <p>O cadastro deu certo e foi enviado ao administrador para ser aprovado. Agora é só esperar :)</p>
                    <Link to="/app" className="btn-success">Voltar para o mapa</Link>
                </div>
                <img src={iconSuccess} alt="" />
            </div>
        </div>
    );
}