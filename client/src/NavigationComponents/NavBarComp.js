import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModalComp from "../UserComponents/LoginModalComp"; // Asegúrate de importar el modal
import { jwtDecode } from "jwt-decode"; // Importa jwt-decode para verificar el token
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

const NavBarComp = () => {
    const [menuOpen, setMenuOpen] = useState(false); // Estado del menú
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Estado del modal de login
    const [redirectPath, setRedirectPath] = useState(""); // Ruta de redirección después del login

    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // Alterna el estado del menú
    };

    const closeMenu = () => {
        setMenuOpen(false); // Cierra el menú al seleccionar una opción
    };

    const checkTokenValidity = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decodifica el token
                // Verificar si el token ha expirado
                if (decoded.exp > Date.now() / 1000) {
                    return true; // El token es válido
                }
            } catch (error) {
                console.log('Token inválido', error);
            }
        }
        return false; // No hay token o el token ha expirado
    };

    const handleLoginClick = (e, path) => {
        e.preventDefault(); // Evita la navegación predeterminada
        if (checkTokenValidity()) {
            navigate(path); // Si el token es válido, redirige directamente
        } else {
            setRedirectPath(path); // Establece la ruta de redirección
            setIsLoginModalOpen(true); // Muestra el modal de login
        }
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false); // Cierra el modal de login
    };

    const handleLoginSuccess = () => {
        closeLoginModal(); // Cierra el modal
        if (redirectPath) {
            navigate(redirectPath); // Navega a la URL objetivo
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="burger-menu">
                    {/* Icono de la hamburguesa */}
                    <button className="burger-icon" onClick={toggleMenu}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>
                    <span onClick={toggleMenu} className="fw-bold menu-text">Menu</span>
                </div>

                {/* Menú desplegable */}
                <div className={`menu ${menuOpen ? "open" : ""}`}>
                    <Link className="fw-bold menu-item" to="/" onClick={closeMenu}>
                        🏠 Home
                    </Link>
                    <Link className="fw-bold menu-item" to="/items" onClick={closeMenu}>
                        📊 Ver Items
                    </Link>
                    <Link className="fw-bold menu-item" to="/search" onClick={closeMenu}>
                        📂 Búsqueda General
                    </Link>
                    {/* Aquí se abre el modal de login antes de navegar */}
                    <Link
                        className="fw-bold menu-item"
                        onClick={(e) => {
                            handleLoginClick(e, "/codigo-patrimonial")
                            closeMenu();
                        }}
                        to="/codigo-patrimonial" // Esto es solo para mantener el formato de link
                    >
                        🗃️ Patrimonizar Bien
                    </Link>
                    <Link className="fw-bold menu-item" to="/trabajador" onClick={closeMenu}>
                        👨‍🌾 Búsqueda por Trabajador
                    </Link>
                    <Link className="fw-bold menu-item" to="/dependencia" onClick={closeMenu}>
                        🏢 Búsqueda por Dependencia
                    </Link>
                    <Link className="fw-bold menu-item" to="/import-excel" onClick={closeMenu}>
                        📚 Importar Datos
                    </Link>
                    <Link className="fw-bold menu-item" to="/user-register" onClick={closeMenu}>
                        👨‍💻 Registro Usuario Autorizado
                    </Link>
                    <a className="fw-bold menu-item" href="/">
                        🌾 GERAGRI Página Principal
                    </a>
                </div>
            </nav>

            {/* Modal de inicio de sesión */}
            <LoginModalComp
                show={isLoginModalOpen}
                handleClose={closeLoginModal}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
};

export default NavBarComp;
