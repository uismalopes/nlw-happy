import React from 'react';
import { FiEdit3, FiTrash } from 'react-icons/fi';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import SidebarDashboard from '../components/SidebarDashboard';

import '../styles/pages/dashboard.css';
import mapIcon from '../utils/mapIcons';

import logoEmpty from '../images/logo-empty.svg';
import { useAuth } from '../context/auth';

export default function Dashboard(){
    const { orphanages } = useAuth();

    if(!orphanages?.length || !orphanages){
        return(
            <div id="page-dashboard">
                <SidebarDashboard />
                <main className="empty">
                    <header>
                        <strong>Orfanatos Cadastrados</strong>
                        <span>0 orfanatos</span>
                    </header>
                    <div className="fallback-empty">
                        <img src={logoEmpty} alt="Happy" />
                        <strong>Nenhum no momento</strong>
                    </div>
                </main>
            </div>
        );
    }

    return(
        <div id="page-dashboard">
            <SidebarDashboard />
            <main>
                <header>
                    <strong>Orfanatos Cadastrados</strong>
                    <span>{orphanages.length} orfanatos</span>
                </header>
                <section>
                    {
                        orphanages.map(orphanage=>{
                            return(
                                <div className="card" key={orphanage.id}>
                                    <div className="card-map">
                                    <Map
                                    center={[orphanage.latitude, orphanage.longitude]} 
                                    zoom={16} 
                                    style={{ width: '100%', height: 227 }}
                                    dragging={false}
                                    touchZoom={false}
                                    zoomControl={false}
                                    scrollWheelZoom={false}
                                    doubleClickZoom={false}
                                    >
                                        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker 
                                        interactive={false} 
                                        icon={mapIcon} 
                                        position={[orphanage.latitude, orphanage.longitude]} 
                                        />
                                    </Map>
                                    </div>
                                    <div className="card-footer">
                                        <strong>{orphanage.name}</strong>
                                        <div className="icons">
                                            <Link to={`/editOrphanage/${orphanage.id}`}>
                                                <FiEdit3 size={20} color="#15C3D6" />
                                            </Link>
                                            <Link to={`/delete/${orphanage.id}`}>
                                                <FiTrash size={20} color="#15C3D6" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </section> 
            </main>
        </div>
    );
}