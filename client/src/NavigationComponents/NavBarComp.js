import React, { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import LoginModalComp from "../UserComponents/LoginModalComp.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

const NavBarComp = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleLoginClick = (e) => {
        e.preventDefault(); // Evita la redirección predeterminada
        setIsLoginModalOpen(true); // Muestra el modal
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false); // Oculta el modal
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
                    href="/codigo-patrimonial"
                    onClick={handleLoginClick} // Interceptamos el clic
                >
                    🗃️ Búsqueda por Código Patrimonial
                </a>
                <a className="menu-item" href="/trabajador">
                    👨‍🌾 Búsqueda por Trabajador
                </a>
                <a className="menu-item" href="/dependencia">
                    🏢 Búsqueda por Dependencia
                </a>
                <a className="menu-item" href="/doble-busqueda">
                    🔎 Doble Busqueda (Trabajador & Item)
                </a>
                <a className="menu-item" href="/import-excel">
                    📚 Importar Datos
                </a>
                <a className="menu-item" href="/user-register">
                    👨‍💻 Registro Usuario Autorizado
                </a>
            </Menu>
            <LoginModalComp show={isLoginModalOpen} onClose={closeLoginModal} />
        </>
    );
};

export default NavBarComp;
