import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';

const URL = process.env.REACT_APP_API_URL_USER;

const ProtectedRouteComp = ({ children }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [sessionStatus, setSessionStatus] = useState('active'); // 'active', 'expired', 'logged-out'
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(localStorage.getItem('user')) : null;

    // Clear session data
    const clearSession = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    // Logout function
    const handleLogout = async () => {
        try {
            if (token) {
                await axios.post(`${URL}/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            clearSession();
            setSessionStatus('logged-out');

            Swal.fire({
                icon: "success",
                title: "Sesión cerrada",
                text: "Has cerrado sesión correctamente.",
                showConfirmButton: true,
                confirmButtonText: "Ok",
                timer: 1500,
            }).then(() => {
                navigate("/");
            });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            Swal.fire("Error", "Hubo un problema al cerrar sesión.", "error");
        }
    };

    // Check authentication status
    const isAuthenticated = () => {
        if (!token || !user) {
            setSessionStatus('expired');
            return false;
        }

        try {
            const decoded = jwtDecode(token);
            const expirationTime = decoded.exp * 1000;
            const currentTime = Date.now();
            const remainingTime = expirationTime - currentTime;

            if (remainingTime <= 0) {
                setSessionStatus('expired');
                clearSession();
                return false;
            }

            // Show warning if less than 5 minutes remaining
            if (remainingTime < 11400000) {
                setShowWarning(true);
                const hours = Math.floor(remainingTime / 3600000);
                const minutes = Math.floor((remainingTime % 3600000) / 60000);
                const seconds = Math.floor((remainingTime % 60000) / 1000);
                setTimeLeft(`${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
            } else {
                setShowWarning(false);
            }

            return true;
        } catch (error) {
            console.log('Token inválido', error);
            setSessionStatus('expired');
            clearSession();
            return false;
        }
    };

    // Handle session status changes
    useEffect(() => {
        if (sessionStatus === 'expired') {
            Swal.fire({
                icon: 'error',
                title: 'Sesión expirada',
                text: 'Necesitas iniciar sesión para obtener un token de acceso.',
                timer: 4000,
                timerProgressBar: true,
            }).then(() => navigate('/'));
        }
    }, [sessionStatus]);

    // Check token periodically
    useEffect(() => {
        if (sessionStatus !== 'logged-out') {
            const interval = setInterval(() => {
                isAuthenticated();
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [sessionStatus]);

    // Immediate token validation check
    useEffect(() => {
        if (!token || !user) {
            setSessionStatus('expired');
        }
    }, []);

    // Redirect if not active session
    if (sessionStatus !== 'active') {
        return <Navigate to="/" />;
    }

    return (
        <div>
            {showWarning && (
                <div style={{ backgroundColor: "yellow", padding: "10px", marginBottom: "20px" }}>
                    <div className='row'>
                        <div className='col-md-10'>
                            <p className="fw-bold mt-2">
                                ¡Atención! <strong>{user}</strong>, su sesión expira en{" "}
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