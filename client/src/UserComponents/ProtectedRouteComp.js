import React, { useState, useEffect, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom'; // Usamos Navigate para redirigir
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

    let user;
    try {
        user = token ? JSON.parse(localStorage.getItem('user')) : null; // Validar el token ? - Convertir el string de vuelta a un objeto 
    }
    catch {
        user = null;
    }

    // Función de Logout
    const handleLogout = async () => {
        try {
            if (token) {
                await axios.post(`${URL}/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            console.log("STATE: ", isLoggedOut)
            setIsLoggedOut(true) // Establecer el estado como logout manual

            Swal.fire({
                icon: "success",
                title: "Sesión cerrada",
                text: "Has cerrado sesión correctamente.",
                showConfirmButton: true,
                confirmButtonText: "Ok",
                timer: 1500,
            }).then(() => navigate("/")); // Navega a la página de inicio de sesión
        } catch (error) {
            console.error("Error al cerrar sesión: ", error);
            alert("Hubo un problema al cerrar sesión: ", error);
        }
    };

    // Decodificar token de forma segura
    const decodedToken = useMemo(() => {
        if (!token) return null;
        try {
            return jwtDecode(token);
        } catch {
            return null;
        }
    }, [token]);

    useEffect(() => {
        if (!decodedToken) {
            setExpired(true);
            return;
        }

        const checkAuth = () => {
            const expirationTime = decodedToken.exp * 1000;
            const currentTime = Date.now();
            const remainingTime = expirationTime - currentTime;

            if (remainingTime <= 0) {
                setExpired(true);
                Swal.fire({
                    icon: 'error',
                    title: 'Sesión expirada',
                    text: 'Necesitas iniciar sesión.',
                    timer: 4000,
                    timerProgressBar: true,
                }).then(() => navigate('/'));
                return;
            }

            if (remainingTime < 11400000) { // 5 minutos
                setShowWarning(true);

                // Calcular horas, minutos y segundos
                const hours = Math.floor(remainingTime / 3600000); // Calcular horas
                const minutes = Math.floor((remainingTime % 3600000) / 60000); // Calcular minutos
                const seconds = Math.floor((remainingTime % 60000) / 1000); // Calcular segundos

                // Establecer el tiempo restante en formato HH:mm:ss
                setTimeLeft(`${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
            } else {
                setShowWarning(false);
            }
        };

        const interval = setInterval(checkAuth, 1000);
        return () => clearInterval(interval);
    }, [decodedToken, navigate]);

    if (expired || !decodedToken) {
        return <Navigate to="/" />;
    }




    return (
        <div>
            {showWarning && (
                <div style={{ backgroundColor: "yellow", padding: "10px", marginBottom: "20px" }}>
                    <div className='row'>
                        <div className='col-md-10'>
                            <p className="fw-bold mt-2">
                                ¡Atención! <strong>{user || "Usuario"}</strong>, su sesión expira en{" "}
                                <strong>{timeLeft}</strong>
                            </p>
                        </div>
                        <div className='col-md-2'>
                            <button
                                onClick={handleLogout}
                                style={{
                                    backgroundColor: "red",
                                    color: "white",
                                    borderRadius: "7px",
                                    border: "none",
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