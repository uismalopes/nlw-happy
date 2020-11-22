import React, { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { useHistory, useParams } from "react-router-dom";

import { FiCheck, FiPlus, FiX, FiXCircle } from "react-icons/fi";

import '../styles/pages/edit-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcons";
import { LeafletMouseEvent } from "leaflet";
import api from "../services/api";
import { AxiosResponse } from "axios";
import { useAuth } from "../context/auth";
import InputMask from "../components/InputMask";

interface OrphanageParams {
  id: string;
}

interface OrphanageData {
    name: string;
    about: string;
    instructions: string;
    opening_hours: string;
    open_on_weekends: boolean;
    latitude: number;
    longitude: number;
    images: Array<{
      id: string;
      url: string;
    }>;
    phone: string;
    published: boolean;
}

export default function EditOrphanage() {
  const params = useParams<OrphanageParams>();
  const { id } = params;

  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0});

  // FORM
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [phone, setPhone] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [published, setPublished] = useState(false);
  const {updateOrphanages} = useAuth();

  function handleMapClick(event: LeafletMouseEvent){
      const {lat, lng} = event.latlng;
      setPosition({
        latitude: lat,
        longitude: lng
      });
  }

  function handleMask(value: string){
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g,"($1) $2");
    value = value.replace(/(\d)(\d{4})$/,"$1-$2");
    return value;
  }

  function handleRemoveImage(index: number){
      const filterImages = images.filter((img, idx)=>{
          return idx !== index;
      });
      
      const filterUrl = previewImages.filter((url, idx)=>{
          return idx !== index;
      });
      
      setImages(filterImages);
      setPreviewImages(filterUrl);
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>){
      if(!event.target.files) return;
      const selectedImages = Array.from(event.target.files);
      setImages(selectedImages);

      const selectedImagesPreview = selectedImages.map(image=> {
        return URL.createObjectURL(image);
      });

      setPreviewImages(selectedImagesPreview);
      event.target.value = '';
  }

  async function handlePublished(){
      await api.put(`orphanages/${id}`, { published: true });
      updateOrphanages();
      history.push('/dashboard');
  }

  async function handleSubmit(event: FormEvent){
      event.preventDefault();
      const { latitude, longitude } = position;

      const data = {
        name,
        about,
        phone: phone.replace(/[^0-9]/g, ''),
        instructions,
        opening_hours,
        open_on_weekends,
        latitude, 
        longitude 
      };

      await api.put(`orphanages/${id}`, data);
      updateOrphanages();
      history.push('/dashboard');
  }

  async function handleRefuse(){
    await api.delete(`orphanages/${id}`);
    updateOrphanages();
    history.push('/dashboard');
  } 

  useEffect(()=>{
      api.get(`orphanagesDashboard/${id}`).then(response=>{
          const {data} = response as AxiosResponse<OrphanageData>;
          setName(data.name);
          setAbout(data.about);
          const images = data.images.map(image=>{
              return image.url;
          });
          setPreviewImages(images);
          setInstructions(data.instructions);
          setOpenOnWeekends(data.open_on_weekends);
          setOpeningHours(data.opening_hours);
          setPhone(data.phone ? handleMask(data.phone) : '');
          setPosition({ latitude: data.latitude, longitude: data.longitude });

          setPublished(data.published);
      });
  }, [id]);


  return (
    <div id="page-edit-orphanage">
      <Sidebar />
      <main>
        <form className="edit-orphanage-form" autoComplete="off" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            
                <Map 
                  center={[ position.latitude, position.longitude ]} 
                  style={{ width: '100%', height: 280 }}
                  zoom={15}
                  onclick={published ? handleMapClick : ()=> {} }
                  dragging={!!published}
                  touchZoom={!!published}
                  zoomControl={!!published}
                  scrollWheelZoom={!!published}
                  doubleClickZoom={!!published}
                >
                  <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {
                    position.latitude !== 0 && (
                      <Marker 
                      interactive={false} 
                      icon={mapIcon} 
                      position={[ position.latitude , position.longitude]} /> 
                    )
                  }
                </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
              id="name" 
              value={name} 
              onChange={event=> setName(event.target.value)} 
              required
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} value={about} onChange={event=> setAbout(event.target.value)} required />
            </div>

            <div className="input-block">
              <label htmlFor="phone">Número de contato</label>
              <InputMask 
              mask="phone"
              id="phone" 
              value={phone} 
              onChange={event=> setPhone(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {
                  previewImages.map((image, index)=>{
                    return(
                      <div key={image} className="selected-image">
                          <button type="button" className="delete-image" onClick={()=> handleRemoveImage(index)}>
                            <FiX size={22} color="#FF669D" />
                          </button>
                          <img src={image} alt={name} />
                      </div>
                    );
                  })
                }
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input 
              multiple 
              accept="image/*" 
              onChange={handleSelectImages} 
              type="file"
              id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea 
              id="instructions" 
              value={instructions} 
              onChange={event => setInstructions(event.target.value)} 
              required
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input 
              id="opening_hours" 
              value={opening_hours} 
              onChange={event => setOpeningHours(event.target.value)} 
              required
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                type="button" 
                className={ open_on_weekends ? 'active' : '' }
                onClick={()=> setOpenOnWeekends(true)}
                >Sim</button>
                <button 
                type="button"
                className={ !open_on_weekends ? 'active' : '' }
                onClick={()=> setOpenOnWeekends(false)}
                >Não</button>
              </div>
            </div>
          </fieldset>

          {
            published ? (
              <button className="confirm-button default-button" type="submit">
                Confirmar
              </button>
            ): (
              <div className="container-buttons">
                <button className="cancel-button default-button" type="button" onClick={handleRefuse}>
                  <FiXCircle /> Recusar
                </button>
                <button className="confirm-button default-button" type="button" onClick={handlePublished}>
                  <FiCheck /> Confirmar
                </button>
              </div>
            )
          }
        </form>
      </main>
    </div>
  );
}