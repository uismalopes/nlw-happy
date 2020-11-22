import React from 'react';
import { FiAlertCircle, FiMapPin, FiPower } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/auth';
import mapMarkerImg from '../images/map-marker.svg';

import '../styles/components/sidebar-dashboard.css';

export default function SidebarDashboard() {
    const { signOut } = useAuth();
    const { pendingOrphanages } = useAuth();

    return(
        <aside className="app-sidebar-dashboard">
            <img src={mapMarkerImg} alt="Happy" />
            <div className="middle-container">
                <NavLink to="/dashboard" activeClassName="active-router">
                    <FiMapPin size={24} />
                </NavLink>
                <NavLink to="/pendingOrphanages" activeClassName="active-router">
                    <span className="content-link">
                        <FiAlertCircle size={24} />
                        {
                            pendingOrphanages?.length ? (
                                <span className="pending-circle"></span>
                            ) : ''
                        }
                    </span>
                </NavLink>
            </div>
            <footer>
                <button type="button" onClick={signOut}>
                    <FiPower size={24} color="#FFF" />
                </button>
            </footer>
        </aside>
    );
}