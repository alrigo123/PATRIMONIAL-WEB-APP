import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importar useLocation
import LoginModalComp from "../UserComponents/LoginModalComp";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

const NavBarComp = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [redirectPath, setRedirectPath] = useState("");
    const navigate = useNavigate();
    const location = useLocation(); // Obtiene la ruta actual

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    const checkTokenValidity = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp > Date.now() / 1000) {
                    return true;
                }
            } catch (error) {
                console.log('Token inválido', error);
            }
        }
        return false;
    };

    const handleLoginClick = (e, path) => {
        e.preventDefault();
        if (checkTokenValidity()) {
            navigate(path);
        } else {
            setRedirectPath(path);
            setIsLoginModalOpen(true);
        }
    };

    const closeLoginModal = () => setIsLoginModalOpen(false);

    const handleLoginSuccess = () => {
        closeLoginModal();
        if (redirectPath) navigate(redirectPath);
    };

    // Función para determinar si un enlace está activo
    const isActive = (path) => location.pathname === path ? "active" : "";

    return (
        <>
            <nav className="navbar">
                <div className="burger-menu">
                    <button className="burger-icon" onClick={toggleMenu}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>
                    <span onClick={toggleMenu} className="fw-bold menu-text">Menu</span>
                </div>
                <div className={`menu ${menuOpen ? "open" : ""}`}>
                    <Link className={`fw-bold menu-item ${isActive("/")}`} to="/" onClick={closeMenu}>
                        🏠 Home
                    </Link>
                    <Link className={`fw-bold menu-item ${isActive("/pdf")}`} to="/pdf" onClick={closeMenu}>
                        <i className="bi bi-file-earmark-pdf-fill" style={{ color: '#c70606', backgroundColor: 'transparent' }}></i> Guía Aplicativo
                    </Link>
                    <Link className={`fw-bold menu-item ${isActive("/items")}`} to="/items" onClick={closeMenu}>
                        📊 Ver Items
                    </Link>
                    <Link className={`fw-bold menu-item ${isActive("/search")}`} to="/search" onClick={closeMenu}>
                        📂 Búsqueda General
                    </Link>
                    <Link className={`fw-bold menu-item ${isActive("/codigo-patrimonial")}`}
                        onClick={(e) => {
                            handleLoginClick(e, "/codigo-patrimonial");
                            closeMenu();
                        }}
                        to="/codigo-patrimonial">
                        🗃️ Registrar Bien
                    </Link>
                    <Link className={`fw-bold menu-item ${isActive("/trabajador")}`}
                        onClick={(e) => {
                            handleLoginClick(e, "/trabajador");
                            closeMenu();
                        }}
                        to="/trabajador">
                        👨‍🌾 Búsqueda por Trabajador
                    </Link>
                    {/* <Link className={`fw-bold menu-item ${isActive("/trabajador")}`} to="/trabajador" onClick={closeMenu}>
                        👨‍🌾 Búsqueda por Trabajador
                    </Link> */}
                    <Link className={`fw-bold menu-item ${isActive("/dependencia")}`}
                        onClick={(e) => {
                            handleLoginClick(e, "/dependencia");
                            closeMenu();
                        }}
                        to="/dependencia">
                        🏢 Búsqueda por Dependencia
                    </Link>
                    <Link className={`fw-bold menu-item ${isActive("/user-register")}`} to="/user-register" onClick={closeMenu}>
                        👨‍💻 Registro Usuario Autorizado
                    </Link>
                    <a className="fw-bold menu-item" href="/">
                        🌾 GERAGRI Página Principal
                    </a>
                </div>
            </nav>
            <LoginModalComp show={isLoginModalOpen} handleClose={closeLoginModal} onLoginSuccess={handleLoginSuccess} />
        </>
    );
};

export default NavBarComp;
