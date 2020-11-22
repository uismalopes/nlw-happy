import React, { useEffect, useState } from 'react';
import '../styles/pages/confirm-delete.css';

import iconDelete from '../images/icon-delete.svg';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { AxiosResponse } from 'axios';
import Loading from '../components/Loading';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useAuth } from '../context/auth';

interface RouteParams {
    id: string;
}

interface Orphanage {
    id: number;
    name: string;
}

export default function ConfirmDelete(){
    const params = useParams<RouteParams>();
    const [ orphanage, setOrphanage ] = useState<Orphanage>();
    const [isDelete, setDelete] = useState(false);
    const { id } = params;
    const { updateOrphanages } = useAuth();

    useEffect(()=>{
        api.get(`orphanagesDashboard/${id}`).then(response=>{
            const { data }= response as AxiosResponse<Orphanage>;
            setOrphanage(data);
        });
    }, [ id ]);

    function handleDelete(){
        try {
            api.delete(`orphanages/${id}`).then(res=>{
                updateOrphanages();
            });
            setDelete(true);
        } catch (error) {
            setDelete(true);
        }
    }

    if(!orphanage) return <Loading />

    return(
        <div id="page-confirm-delete">
            <div className="grid-template">
                <div className="description">
                    <strong>Excluir!</strong>
                    <p> { 
                    isDelete ? 
                    `${orphanage.name} excluído com sucesso` : 
                    `Você tem certeza que quer excluir ${orphanage.name}?` 
                    }</p>
                    {
                        isDelete ? (
                            <Link to="/dashboard" className="btn-success">Voltar para o mapa</Link>
                        ) : (
                        <div className="controll-btn">
                            <button className="btn btn-yes" onClick={handleDelete}>
                                <FiCheckCircle /> Sim
                            </button>
                            <Link to="/dashboard" className="btn btn-no">
                                <FiXCircle /> Não
                            </Link>
                        </div>
                        )
                    }
                    
                </div>
                <img src={iconDelete} alt="" />
            </div>
        </div>
    );
}