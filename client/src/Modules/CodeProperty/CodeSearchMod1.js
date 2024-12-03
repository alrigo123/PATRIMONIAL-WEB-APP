import React, { useState, useRef } from 'react';
import axios from 'axios';
import { parseDate } from '../../utils/datesUtils';

const URL = process.env.REACT_APP_API_URL_ITEMS

const CodeSearchMod1 = () => {
  const [barcode, setBarcode] = useState('');
  const [itemData, setItemData] = useState(null);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setBarcode(value);

      if (value.length === 12) {
        fetchItem(value);
      }
    }
  };

  const fetchItem = async (code) => {
    try {
      const response = await axios.get(`${URL}/${code}`);
      setItemData(response.data || null);
    } catch (error) {
      console.log('Error al obtener el item:', error);
      setItemData(null);
    }
  };

  const clearInput = () => {
    setBarcode('');
    setItemData(null);
    inputRef.current.focus();
  };

  return (
    <div>
      {/* Sección de búsqueda para items */}
      <h5 className="text-lg-start fw-bold">REGISTRAR BIEN PATRIMONIAL</h5>
      <div className="row g-3">
        <div className="col-10">
          <input
            type="text"
            placeholder="Escanear código (barras) patrimonial"
            value={barcode}
            onChange={handleInputChange}
            ref={inputRef}
            className="form-control mb-3 fw-bold"
            style={{ marginBottom: '20px', fontSize: '1.2rem', padding: '10px' }}
          />
        </div>
        <div className="col-2">
          <button
            onClick={clearInput}
            className="btn btn-dark mb-3 fw-bold"
            style={{ marginBottom: '20px', fontSize: '1.2rem', padding: '10px' }}
          >
            🧹 Limpiar
          </button>
        </div>
      </div>

      {itemData ? (
        <div className="d-flex justify-content-center mt-3">
          <div className="row g-5 align-items-center">
            <div className="col-auto text-start">
              <h2 className="text-uppercase fw-bold mb-3"><u>Información del Item</u></h2>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Código Patrimonial: <strong>{itemData.CODIGO_PATRIMONIAL}</strong></h4>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Descripción: <strong>{itemData.DESCRIPCION}</strong></h4>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Dependencia: <strong>{itemData.DEPENDENCIA}</strong></h4>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Ubicación: <strong>{itemData.UBICACION}</strong></h4>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Trabajador: <strong>{itemData.TRABAJADOR}</strong></h4>
              {/* <p><strong>Estado :</strong> {itemData.ESTADO}</p> */}
              <p>
                {itemData.ESTADO === 0 ? (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Estado: <span style={{ color: 'red', fontWeight: 'bold' }}>❌ No Patrimonizado</span></h4>
                ) : (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Estado: <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Patrimonizado</span></h4>
                )}
              </p>
              {/* <p><strong>Ultima Fecha de Registro:</strong> {itemData.FECHA_REGISTRO ? new Date(itemData.FECHA_REGISTRO).toLocaleDateString() : 'No Registrado'}</p> */}
              <p>
                {itemData.DISPOSICION === 0 ? (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Disposición: <span style={{ color: 'red', fontWeight: 'bold' }}>❌ No Funcional </span></h4>
                ) : (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Disposición: <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Funcional</span></h4>
                )}
              </p>
              <p>
                {itemData.SITUACION === 0 ? (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Situación: <span style={{ color: 'red', fontWeight: 'bold' }}>❌ Faltante </span></h4>
                ) : (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Situación: <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Verificado</span></h4>
                )}
              </p>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Fecha de Alta: <strong>{itemData.FECHA_ALTA ? itemData.FECHA_ALTA : 'No Registra'}</strong></h4>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Fecha de Compra: <strong>{itemData.FECHA_COMPRA ? itemData.FECHA_COMPRA : 'No Registra'}</strong></h4>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Ultima Fecha de Registro: <strong>{itemData.FECHA_REGISTRO ? parseDate(itemData.FECHA_REGISTRO) : 'No Registrado'}</strong></h4>
            </div>
          </div>
        </div>
      ) : (
        barcode && <p className="text-center text-danger">No se encontró ningún bien con el CODIGO PATRIMONIAL ingresado.</p>
      )}
    </div>
  )
}

export default CodeSearchMod1
