// import React, { useState } from "react";
// import { slide as Menu } from "react-burger-menu";
// import { useNavigate } from "react-router-dom"; // Importar useNavigate
// import LoginModalComp from "../UserComponents/LoginModalComp";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles/Navbar.css";

// const NavBarComp = () => {
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//     const [redirectPath, setRedirectPath] = useState(""); // URL objetivo
//     const navigate = useNavigate(); // Hook para navegar

//     const handleLoginClick = (e, path) => {
//         e.preventDefault(); // Evita la navegación predeterminada
//         setRedirectPath(path); // Almacena la URL objetivo
//         setIsLoginModalOpen(true); // Muestra el modal
//     };

//     const closeLoginModal = () => {
//         setIsLoginModalOpen(false); // Oculta el modal
//     };

//     const handleLoginSuccess = () => {
//         closeLoginModal(); // Cierra el modal
//         if (redirectPath) {
//             navigate(redirectPath); // Navega a la URL objetivo
//         }
//     };

//     return (
//         <>
//             <Menu>
//                 <a className="menu-item" href="/home">
//                     🏠 Home
//                 </a>
//                 <a className="menu-item" href="/items">
//                     📊 Ver Items
//                 </a>
//                 <a className="menu-item" href="/search">
//                     📂 Búsqueda General
//                 </a>
//                 <a
//                     className="menu-item"
//                     onClick={(e) => handleLoginClick(e, "/codigo-patrimonial")} // Especifica la URL objetivo
//                     href="/codigo-patrimonial"
//                 >
//                     🗃️ Búsqueda por Código Patrimonial
//                 </a>
//                 <a className="menu-item" href="/trabajador">
//                     👨‍🌾 Búsqueda por Trabajador
//                 </a>
//                 <a className="menu-item" href="/dependencia">
//                     🏢 Búsqueda por Dependencia
//                 </a>
//                 {/* <a className="menu-item" href="/doble-busqueda">
//                     🔎 Doble Busqueda (Trabajador & Item)
//                 </a> */}
//                 <a className="menu-item" href="/import-excel">
//                     📚 Importar Datos
//                 </a>
//                 <a className="menu-item" href="/user-register">
//                     👨‍💻 Registro Usuario Autorizado
//                 </a>
//             </Menu>
//             <LoginModalComp
//                 show={isLoginModalOpen}
//                 handleClose={closeLoginModal}
//                 onLoginSuccess={handleLoginSuccess} // Manejo del login exitoso
//             />
//         </>
//     );
// };

// export default NavBarComp

////// ----------------------------

// import React, { useState } from "react";
// import { slide as Menu } from "react-burger-menu";
// import { Link,useNavigate } from "react-router-dom"; // Importar Link
// import LoginModalComp from "../UserComponents/LoginModalComp";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles/Navbar.css";

// const NavBarComp = () => {
//     const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//     const [redirectPath, setRedirectPath] = useState(""); // URL objetivo
//     const navigate = useNavigate();
//     const handleLoginClick = (e, path) => {
//         e.preventDefault(); // Evita la navegación predeterminada
//         setRedirectPath(path); // Almacena la URL objetivo
//         setIsLoginModalOpen(true); // Muestra el modal
//     };

//     const closeLoginModal = () => {
//         setIsLoginModalOpen(false); // Oculta el modal
//     };

//     const handleLoginSuccess = () => {
//         closeLoginModal(); // Cierra el modal
//         if (redirectPath) {
//             navigate(redirectPath); // Navega a la URL objetivo
//         }
//     };

//     return (
//         <>
//             <Menu>
//                 <Link className="menu-item" to="/">🏠 Home</Link>
//                 <Link className="menu-item" to="/items">📊 Ver Items</Link>
//                 <Link className="menu-item" to="/search">📂 Búsqueda General</Link>
//                 <Link className="menu-item" onClick={(e) => handleLoginClick(e, "/codigo-patrimonial")} to="/codigo-patrimonial">🗃️ Búsqueda por Código Patrimonial</Link>
//                 <Link className="menu-item" to="/trabajador">👨‍🌾 Búsqueda por Trabajador</Link>
//                 <Link className="menu-item" to="/dependencia">🏢 Búsqueda por Dependencia</Link>
//                 <Link className="menu-item" to="/import-excel">📚 Importar Datos</Link>
//                 <Link className="menu-item" to="/user-register">👨‍💻 Registro Usuario Autorizado</Link>
//             </Menu>
//             <LoginModalComp
//                 show={isLoginModalOpen}
//                 handleClose={closeLoginModal}
//                 onLoginSuccess={handleLoginSuccess} // Manejo del login exitoso
//             />
//         </>
//     );
// };

// export default NavBarComp;

import React, { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link, useNavigate } from "react-router-dom";
import LoginModalComp from "../UserComponents/LoginModalComp";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

const NavBarComp = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [redirectPath, setRedirectPath] = useState("");
    const [menuOpen, setMenuOpen] = useState(false); // Controla el estado del menú
    const navigate = useNavigate();

    const handleLoginClick = (e, path) => {
        e.preventDefault(); // Evita la navegación predeterminada
        setRedirectPath(path);
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

    // Función para manejar el cierre del menú al hacer clic
    const closeMenu = () => {
        setMenuOpen(false); // Cambia el estado de apertura del menú
    };

    return (
        <>
            <Menu isOpen={menuOpen} onStateChange={({ isOpen }) => setMenuOpen(isOpen)}>
                <Link className="menu-item" to="/" onClick={closeMenu}>🏠 Home</Link>
                <Link className="menu-item" to="/items" onClick={closeMenu}>📊 Ver Items</Link>
                <Link className="menu-item" to="/search" onClick={closeMenu}>📂 Búsqueda General</Link>
                <Link className="menu-item" onClick={(e) => { handleLoginClick(e, "/codigo-patrimonial"); closeMenu(); }} to="/codigo-patrimonial">🗃️ Búsqueda por Código Patrimonial</Link>
                <Link className="menu-item" to="/trabajador" onClick={closeMenu}>👨‍🌾 Búsqueda por Trabajador</Link>
                <Link className="menu-item" to="/dependencia" onClick={closeMenu}>🏢 Búsqueda por Dependencia</Link>
                <Link className="menu-item" to="/import-excel" onClick={closeMenu}>📚 Importar Datos</Link>
                <Link className="menu-item" to="/user-register" onClick={closeMenu}>👨‍💻 Registro Usuario Autorizado</Link>
            </Menu>
            <LoginModalComp
                show={isLoginModalOpen}
                handleClose={closeLoginModal}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
};

export default NavBarComp;