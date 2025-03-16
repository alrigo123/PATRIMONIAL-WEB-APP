import { useState, useEffect } from 'react';
import "../styles/PopNotify.css";
const PopNotify = () => {
    const [isMobile, setIsMobile] = useState(false); // State to check if the device is mobile (responsive)
    const [showTip, setShowTip] = useState(true);  // State to control the visibility of the message

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768); // O cualquier otro ancho que consideres como móvil (responsive)
        };

        window.addEventListener("resize", checkIfMobile); // Añadir el listener al evento de redimensionamiento
        checkIfMobile();
        return () => window.removeEventListener("resize", checkIfMobile); // Eliminar el listener al evento de redimensionamiento
    }, []);

    useEffect(() => {
        // Si es móvil, mostrar el mensaje
        if (isMobile) {
            const timer = setTimeout(() => {
                setShowTip(false);  // Ocultar el mensaje después de 10 segundos
            }, 7000); // 7 segundos

            return () => clearTimeout(timer);  // Limpiar el temporizador si el componente se desmonta
        }
    }, [isMobile]);

    return (
        <div>
            {isMobile && showTip && (
                <div className="scroll-tip">
                    <span className="scroll-icon">👉</span>
                    <p>Deslizar para ver la tabla completa</p>
                </div>
            )}
        </div>
    )
}

export default PopNotify
