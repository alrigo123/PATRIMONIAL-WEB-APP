import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import '../styles/Error404.css'

const Error404 = () => {
    const navigate = useNavigate();

    return (
        <div className="error404-container">
            <Player
                autoplay
                loop
                src="https://assets6.lottiefiles.com/packages/lf20_suhe7qtm.json" // Cambia el URL de la animación
                style={{ height: '300px', width: '300px' }}
            />
            <h1 className='mb-2'>¡Oops! Página no encontrada</h1>
            <button className="mt-2 home-button" onClick={() => navigate('/ ')}>
                Volver al inicio
            </button>
        </div>
    );
};

export default Error404;
