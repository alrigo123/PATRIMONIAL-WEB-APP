import React from 'react'
import '../styles/Footer.css'

const FooterComp = () => {
    return (
        <div className='mb-0'>
            <footer className="footer">
                <p>Desarrollado por <strong>OPPM / Oficina de Informática</strong></p>
                <p className='fw-bold'>&copy; {new Date().getFullYear()} GERAGRI CUSCO</p>
            </footer>
        </div>
    )
}

export default FooterComp
