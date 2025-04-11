import React from 'react'
import '../styles/Footer.css'

const FooterComp = () => {
    return (
        <div className='mb-0'>
            <footer className="footer">
                <div className="text-center small">
                    <p className="mb-0">© GERAGRI {new Date().getFullYear()} Gerencia Regional de Agricultura - Cusco. Todos los derechos reservados.</p>
                    <p>Diseñado por <strong>OPPM / Oficina de Informática</strong></p>
                </div>
            </footer>
        </div>
    )
}

export default FooterComp
