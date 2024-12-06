import React, { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import LoginModalComp from "../UserComponents/LoginModalComp";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

const NavBarComp = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [redirectPath, setRedirectPath] = useState(""); // URL objetivo
    const navigate = useNavigate(); // Hook para navegar

    const handleLoginClick = (e, path) => {
        e.preventDefault(); // Evita la navegación predeterminada
        setRedirectPath(path); // Almacena la URL objetivo
        setIsLoginModalOpen(true); // Muestra el modal
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false); // Oculta el modal
    };

    const handleLoginSuccess = () => {
        closeLoginModal(); // Cierra el modal
        if (redirectPath) {
            navigate(redirectPath); // Navega a la URL objetivo
        }
    };

    return (
        <>
            <Menu>
                <a className="menu-item" href="/">
                    🏠 Home
                </a>
                <a className="menu-item" href="/items">
                    📊 Ver Items
                </a>
                <a className="menu-item" href="/search">
                    📂 Búsqueda General
                </a>
                <a
                    className="menu-item"
                    onClick={(e) => handleLoginClick(e, "/codigo-patrimonial")} // Especifica la URL objetivo
                    href="/codigo-patrimonial"
                >
                    🗃️ Búsqueda por Código Patrimonial
                </a>
                <a className="menu-item" href="/trabajador">
                    👨‍🌾 Búsqueda por Trabajador
                </a>
                <a className="menu-item" href="/dependencia">
                    🏢 Búsqueda por Dependencia
                </a>
                {/* <a className="menu-item" href="/doble-busqueda">
                    🔎 Doble Busqueda (Trabajador & Item)
                </a> */}
                <a className="menu-item" href="/import-excel">
                    📚 Importar Datos
                </a>
                <a className="menu-item" href="/user-register">
                    👨‍💻 Registro Usuario Autorizado
                </a>
            </Menu>
            <LoginModalComp
                show={isLoginModalOpen}
                handleClose={closeLoginModal}
                onLoginSuccess={handleLoginSuccess} // Manejo del login exitoso
            />
        </>
    );
};

export default NavBarComp
