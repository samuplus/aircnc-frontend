import React, { useState, useMemo } from 'react';
import api from '../../services/api';
// import Dropzone from 'react-dropzone';
import camera from '../../assets/camera.svg';

import './styles.css';

export default function New({ history }){
    const [thumbnail, setThumbnail] = useState(null); 
    const [company, setCompany] = useState('');
    const [techs, setTechs] = useState('');
    const [price, setPrice] = useState('');
    
    function handleDragOver(event) {
        event.preventDefault();
    }
    
    function handleDrop(event) {
        event.preventDefault();

        const item = event.dataTransfer.items[0].getAsFile();
        setThumbnail(item);
    }

    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null
    }, [thumbnail])

    async function handleSubmit(event){
        event.preventDefault();
        
        
        const data = new FormData();
        const user_id = localStorage.getItem('user');

        data.append('thumbnail', thumbnail);
        data.append('company', company);
        data.append('techs', techs);
        data.append('price', price);

        await api.post('/spots', data, {
            headers: {user_id}
        })

        history.push('/dashboard');
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <label 
                id="thumbnail" 
                style={{backgroundImage: `url(${preview})` }}
                className={thumbnail ? `has-thumbnail` : ''}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <input type="file" onChange={event => setThumbnail(event.target.files[0])} />
                <img src={camera} alt="Select img" />
            </label>

            <label htmlFor="company">COMPANY * </label>
            <input
                id="company"
                placeholder="Your company name"
                value={company}
                onChange={event => setCompany(event.target.value)}
            />

            <label htmlFor="techs">TECHNOLOGIES * <span>(separate by comma)</span> </label>
            <input
                id="techs"
                placeholder="The name of the techs used in your company"
                value={techs}
                onChange={event => setTechs(event.target.value)}
            />   

            <label htmlFor="price">DAILY RATE * <span>(only numbers - leave black for free desks)</span> </label>
            <input
                id="price"
                placeholder="The daily rate charged for this desk"
                value={price}
                onChange={event => setPrice(event.target.value)}
            />           
            <button className='btn'>REGISTER</button>
        </form>
    )

}