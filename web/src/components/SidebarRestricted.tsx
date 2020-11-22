import React from 'react';
import '../styles/components/sidebar-restricted.css';

import logotipo from '../images/logotipo.svg';

export default function SidebarRestricted(){
    return(
        <aside className="app-sidebar-restricted">
            <img src={logotipo} alt="Happy" />
            <div className="description">
                <strong>São Paulo</strong>
                <span>São Paulo</span>
            </div>
        </aside>
    );
}