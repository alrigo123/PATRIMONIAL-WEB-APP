import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert2

import CodeSearchMod1 from '../Modules/CodeProperty/CodeSearchMod1';
// import CodeSearchMod1 from '../test/V1CodeSearchMod1.js'
import CodeSearchMod2 from '../Modules/CodeProperty/CodeSearchMod2';

const CodePropertyComp = () => {

    const navigate = useNavigate();

    const handleAddItem = () => {
        Swal.fire({
            title: '¿Añadir Ítem?',
            // text: "Puede añadir varios items importando un archivo excel",
            icon: 'warning',
            showCancelButton: true,
            // showDenyButton: true, // Agrega un tercer botón
            confirmButtonColor: '#3085d6',
            denyButtonColor: '#0ea14c',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Añadir ítem',
            denyButtonText: 'Importar archivo excel',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/add');
            } else if (result.isDenied) {
                // navigate('/import-excel');
            }
        });
    };

    return (
        <div className="container my-4">
            <h2 className="text-center mb-3 fw-bold">BUSCAR BIEN POR CÓDIGO PATRIMONIAL</h2>
            <button onClick={handleAddItem} className="btn btn-primary p-3 fw-bolder mb-4">
                {/* <button onClick={handleAddItem} className="btn btn-primary p-3 fw-bolder col-12 col-sm-6 col-md-4 d-flex justify-content-center mb-2"> */}
                📦 AGREGAR NUEVO BIEN
            </button>
            <CodeSearchMod1 />
            <hr className="border border-success border-2 opacity-100 mb-4" />
            <CodeSearchMod2 />
        </div>
    );
};

export default CodePropertyComp;
