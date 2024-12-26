import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom'; // Usamos Navigate para redirigir
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de usar 'jwt-decode'
import Swal from 'sweetalert2';
import axios from 'axios';

const URL = process.env.REACT_APP_API_URL_USER;

const ProtectedRouteComp = ({ children }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [expired, setExpired] = useState(false);
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')); // Convertir el string de vuelta a un objeto

    // Función de Logout
    const handleLogout = async () => {
        try {
            if (token) {
                await axios.post(`${URL}/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                );
            }
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Establecer el estado como logout manual
            setIsLoggedOut(true)

            // Mostrar alerta con SweetAlert2
            Swal.fire({
                icon: "success",
                title: "Sesión cerrada",
                text: "Has cerrado sesión correctamente.",
                showConfirmButton: true,
                confirmButtonText: "Ok",
                timer: 1500, // Opcional: tiempo para cerrar la alerta automáticamente
            }).then(() => {
                navigate("/"); // Navega a la página de inicio de sesión
            });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("Hubo un problema al cerrar sesión.");
        }
    };

    const isAuthenticated = () => {

        if (token && user) {
            try {
                const decoded = jwtDecode(token); // Decodifica el token

                const expirationTime = decoded.exp * 1000; // Convertir a milisegundos
                const currentTime = Date.now();
                const remainingTime = expirationTime - currentTime; // Calcular el tiempo restante en milisegundos

                // Verificar si el token ha expirado
                if (remainingTime <= 0) {
                    setExpired(true); // Si el token ha expirado, redirige
                    // Mostrar un modal con SweetAlert
                    Swal.fire({
                        icon: 'error',
                        title: 'Sesión expirada',
                        text: 'Necesitas iniciar sesión para obtener un token de acceso.',
                        timer: 4000, // Temporizador de 2 segundos
                        timerProgressBar: true, // Muestra la barra de progreso del temporizador
                    }).then(() => {
                        // Redirigir a la página de login o página inicial
                        navigate('/'); // O cualquier ruta a la que quieras redirigir al usuario
                    });
                    return false;
                }

                // Si el tiempo restante es menor a 90 minutos, muestra la advertencia
                if (remainingTime < 11400000) { // 5 minutos
                    setShowWarning(true);

                    // Calcular horas, minutos y segundos
                    const hours = Math.floor(remainingTime / 3600000); // Calcular horas
                    const minutes = Math.floor((remainingTime % 3600000) / 60000); // Calcular minutos
                    const seconds = Math.floor((remainingTime % 60000) / 1000); // Calcular segundos

                    // Establecer el tiempo restante en formato HH:mm:ss
                    setTimeLeft(`${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
                }
                // Si el token no ha expirado, el usuario está autenticado
                return true;

            } catch (error) {
                console.log('Token inválido', error);
                setExpired(true);
                return false;
            }
        }
        setExpired(true); // Si no hay token, redirige
        return false;
    };

    // Usa useEffect para verificar el token y actualizar el estado cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            isAuthenticated();
        }, 1000); // Cada 1 segundo

        return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    }, []);

    if (expired) {
        return <Navigate to="/" />; // Si el token ha expirado, redirige al login
    }

    return (
        <div>
            {showWarning && (
                <div style={{ backgroundColor: "yellow", padding: "10px", marginBottom: "20px" }}>
                    <div className='row'>
                        <div className='col-md-10'>
                            <p className="fw-bold mt-2">
                                ¡Atención! <strong>{user}</strong>, su sesión expirará en{" "}
                                <strong>{timeLeft}</strong> segundos.
                            </p>
                        </div>
                        <div className='col-md-2'>

                            <button
                                onClick={handleLogout}
                                style={{
                                    backgroundColor: "red",
                                    color: "white",
                                    border: "3px",
                                    padding: "5px 10px",
                                    cursor: "pointer",
                                }}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {children}
        </div>
    );
};

export default ProtectedRouteComp;