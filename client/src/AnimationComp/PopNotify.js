import { useState, useEffect } from 'react';
import "../styles/PopNotify.css";

const PopNotify = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [showTip, setShowTip] = useState(true);  // Estado para controlar la visibilidad del mensaje

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768); // O cualquier otro ancho que consideres como móvil
        };
        window.addEventListener("resize", checkIfMobile);
        checkIfMobile();
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);
    useEffect(() => {
        // Si es móvil, mostrar el mensaje durante 10 segundos
        if (isMobile) {
            const timer = setTimeout(() => {
                setShowTip(false);  // Ocultar el mensaje después de 10 segundos
            }, 7000); // 10 segundos

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
