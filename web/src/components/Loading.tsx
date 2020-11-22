import React from 'react';

import '../styles/components/loading.css';

import logo from '../images/logotipo.svg'

export default function Loading(){
    return(
        <div id="app-loading">
            <img src={logo} alt="Happy" />
            <h1>Carregando...</h1>
        </div>
    );
}