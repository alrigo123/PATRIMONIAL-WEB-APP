import React from 'react'
import '../styles/Home.css'

const HomePageComp = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1 className="title fw-semibold">Control Patrimonial - Gerencia Regional de Agricultura de Cusco</h1>
                <p className="description text-light">
                    Bienvenido al sistema de control patrimonial de la Gerencia Regional de Agricultura.
                    Aquí podra visualizar los bienes registrados, patrimonizar nuevos bienes, gestionar el control de bienes y recursos de la institución.
                </p>
                <div className="cta-container">
                    <a className="btn btn-success fw-bold" href="/items">Ver Bienes Registrados</a>
                    <a className="btn btn-success m-2 fw-bold" href="/codigo-patrimonial">Patrimonizar Nuevo Bienes</a>
                </div>
            </header>
        </div>
    )
}

export default HomePageComp
