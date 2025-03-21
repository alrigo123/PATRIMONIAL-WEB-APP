import React, { useState } from 'react';
import Spreadsheet from 'react-spreadsheet'; // Nueva librería
import Modal from 'react-modal'; // Librería para modales

// Configuración inicial para React Modal
Modal.setAppElement('#root');
const ErrorModalComp = () => {

    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal

    // Método para abrir y cerrar el modal
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    // Datos y columnas de ejemplo para el modal
    const exampleData = [
        [{ value: 'CODIGO_PATRIMONIAL' }, { value: 'DESCRIPCION' },
        { value: 'TRABAJADOR' }, { value: 'DEPENDENCIA' },
        { value: 'UBICACION' }, { value: 'FECHA_COMPRA' }, { value: 'FECHA_ALTA' }],
        [{ value: '011110101012' }, { value: 'ARADOS EN GENERAL' },
        { value: 'ROBERTO QUIROGA MUÑOZ' }, { value: 'SEDE ACOMAYO' },
        { value: 'OFICINA DE ALMACEN' }, { value: '11/03/2011 00:00:00' },
        { value: '14/03/2012' }],
        [{ value: '023342023430' }, { value: 'SILLA GIRATORIA' },
        { value: 'ROBERTO QUIROGA MUÑOZ' }, { value: 'SEDE ACOMAYO' },
        { value: 'OFICINA ADMINISTRACION' }, { value: '14/03/2012' },
        { value: '11/03/2011 00:00:00' }],
    ];

    return (
        <div>
            {/* BUTTON TO OPEN MODAL */}
            <button className='btn btn-warning fw-bold' onClick={toggleModal} style={{ fontSize: '16px', padding: '10px 20px', borderRadius: '5px' }} >
                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Ver Formato Requerido</span>
            </button>
            {/* Modal TO SHOW EXAMPLE GRID*/}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)} // Desactivamos cierre al hacer clic fuera o presionar Esc
                shouldCloseOnOverlayClick={false} // Solo cierra con el botón
                style={{
                    content: {
                        width: '80.5rem',
                        height: '24.5rem',
                        margin: 'auto',
                        textAlign: 'center',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    },
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
                }}
            >
                {/* CONTENT OF THE EXAMPLE */}
                <h2 className='fw-bold' style={{ marginBottom: '20px', color: '#333' }}>Formato Requerido</h2>
                <p className='fw-bold'><u><em>Asegurese de que el archivo a subir tenga el siguiente formato</em></u></p>
                <div style={{ borderRadius: '5px', fontFamily: 'Arial, sans-serif', fontSize: '14px', border: '1px solid #ddd', marginLeft: '10px' }}>
                    <Spreadsheet
                        data={exampleData}
                    />
                </div>
                {/* BUTTON TO CLOSE MODAL */}
                <button
                    onClick={() => setIsModalOpen(false)}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Cerrar</span>
                </button>
            </Modal>
        </div>
    )
}

export default ErrorModalComp;
