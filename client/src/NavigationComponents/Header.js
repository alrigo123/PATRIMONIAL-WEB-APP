import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
const Header = () => {
    return (
        // <header className="bg-success text-white py-3">
        //     <div className="container d-flex justify-content-center align-items-center">
        //         <Link to="/" className="d-flex align-items-center text-white text-decoration-none">
        //             <img
        //                 src="https://www.gob.pe/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTQ1MjczLCJwdXIiOiJibG9iX2lkIn19--2cf59ceccb2713fbc9f17ce81ee16909199760c5/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOltudWxsLDQ4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--830247c4bafe7cadca50817d8559bf1a09e3aa28/LOGO%20GERAGRI1-4.png"
        //                 alt="Logo"
        //                 className="me-3"
        //                 style={{ width: '70px', height: '60px', borderRadius: '50%' }}
        //             />
        //             <h1 className="mb-0 fw-bolder">Aplicación de Inventariado</h1>
        //         </Link>
        //         <button
        //             className="navbar-toggler text-white"
        //             type="button"
        //             data-bs-toggle="collapse"
        //             data-bs-target="#navbarMenu"
        //             aria-controls="navbarMenu"
        //             aria-expanded="false"
        //             aria-label="Toggle navigation"
        //         >
        //             <span className="navbar-toggler-icon"></span>
        //         </button>
        //     </div>
        // </header>
        <header
            className="bg-success text-white py-3"
            style={{
                background: 'linear-gradient(90deg,rgb(44, 175, 74),rgb(24, 121, 45))',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            <div className="container d-flex justify-content-center align-items-center">
                <Link
                    to="/"
                    className="d-flex align-items-center text-white text-decoration-none"
                >
                    <img
                        src="https://geragricusco.gob.pe/favicon.ico"  
                        alt="Logo"
                        className="me-3 header-logo"
                        style={{
                            width: '4.5rem',
                            height: '4.5rem',
                            borderRadius: '50%',
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        }}
                    />
                    <h1 className="mb-0 fw-bolder" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Aplicación de Inventariado
                    </h1>
                </Link>
            </div>
        </header>

    );
};

export default Header;
