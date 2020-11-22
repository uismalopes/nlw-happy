import React, { FormEvent, ChangeEvent, useState, useEffect } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { useHistory } from "react-router-dom";

import { FiPlus, FiX } from "react-icons/fi";

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcons";
import { LeafletMouseEvent } from "leaflet";
import api from "../services/api";
import InputMask from "../components/InputMask";

export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [currentPosition, setCurrentPosition] = useState({ latitude: -23.5499643, longitude: -46.6315566 });

  // FORM
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(false);
  const [phone, setPhone] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(()=>{
        navigator.geolocation.getCurrentPosition(function(position){
            const { coords } = position;
            setCurrentPosition({
                latitude: coords.latitude,
                longitude: coords.longitude
            });
        });
  },[]);

  function handleMapClick(event: LeafletMouseEvent){
      const {lat, lng} = event.latlng;
      setPosition({
        latitude: lat,
        longitude: lng
      });
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

  async function handleSubmit(event: FormEvent){
      event.preventDefault();
      const { latitude, longitude } = position;

      const data = new FormData();

      data.append('name', name);
      data.append('about', about);
      data.append('instructions', instructions);
      data.append('opening_hours', opening_hours);
      data.append('latitude', String(latitude));
      data.append('longitude', String(longitude));
      data.append('open_on_weekends', String(open_on_weekends));
      if(phone){
          data.append('phone', phone.replace(/[^0-9]/g, ''));
      }
      
      images.forEach(image =>{
        data.append('images', image);
      });

      await api.post('orphanages', data);
      history.push('/success');
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form 
        className="create-orphanage-form" 
        autoComplete="off"
        onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[ currentPosition.latitude, currentPosition.longitude ]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
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

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
