import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const URL = process.env.REACT_APP_API_URL_ITEMS

const CodeSearchMod2 = () => {
  const [stateCode, setStateCode] = useState('');
  const [stateData, setStateData] = useState([]);
  const stateInputRef = useRef(null);

  const handleStateInputChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setStateCode(value);

      if (value.length === 12) {
        fetchState(value);
      }
    }
  };

  const fetchState = async (code) => {
    try {
      const response = await axios.get(`${URL}/conservation/${code}`);
      setStateData([response.data] || []);
    } catch (error) {
      console.log('Error al obtener el estado:', error);
      setStateData([]);
    }
  };

  const clearStateInput = () => {
    setStateCode('');
    setStateData([]);
    stateInputRef.current.focus();
  };

  const handleEdit = (item) => {
    if (!item.CODIGO_PATRIMONIAL) {
      console.error('El CODIGO_PATRIMONIAL está indefinido:', item);
      return; // Evita seguir si no hay un código válido
    }
    console.log("Editando CODIGO_PATRIMONIAL:", item.CODIGO_PATRIMONIAL, "CON DATOS:", item);
    // Lógica de edición
  };

  const toggleDisposition = async (itemId, currentEstado) => {
    try {
      // Cambia el estado en el backend
      await axios.put(`${URL}/disposition/${itemId}`, {
        DISPOSICION: currentEstado === 1 ? 0 : 1,
      });

      // Actualiza el estado local sin hacer una nueva búsqueda
      setStateData((prevResults) =>
        prevResults.map((item) =>
          item.CODIGO_PATRIMONIAL === itemId
            ? { ...item, DISPOSICION: currentEstado === 1 ? 0 : 1 }
            : item
        )
      );
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
    }
  };

  const toggleSituation = async (itemId, currentEstado) => {
    try {
      // Cambia el estado en el backend
      await axios.put(`${URL}/situation/${itemId}`, {
        SITUACION: currentEstado === 1 ? 0 : 1,
      });

      // Actualiza el estado local sin hacer una nueva búsqueda
      setStateData((prevResults) =>
        prevResults.map((item) =>
          item.CODIGO_PATRIMONIAL === itemId
            ? { ...item, SITUACION: currentEstado === 1 ? 0 : 1 }
            : item
        )
      );
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
    }
  };

  return (
    <div>
      {/* Sección de búsqueda para estados */}
      <h5 className="text-lg-start fw-bold">CONSULTAR ESTADO DEL BIEN PATRIMONIAL</h5>
      <div className="row g-3">
        <div className="col-10">
          <input
            type="text"
            placeholder="Escanear código (barras) patrimonial"
            value={stateCode}
            onChange={handleStateInputChange}
            ref={stateInputRef}
            className="form-control mb-3 fw-bold"
            style={{ marginBottom: '20px', fontSize: '1.2rem', padding: '10px' }}
          />
        </div>
        <div className="col-2">
          <button
            onClick={clearStateInput}
            className="btn btn-dark mb-3 fw-bold"
            style={{ marginBottom: '20px', fontSize: '1.2rem', padding: '10px' }}
          >
            🧹 Limpiar
          </button>
        </div>
      </div>

      {stateData.length > 0 ? (
        <div className="mt-3">
          <table className="w-auto table table-striped table-bordered align-middle mb-5" style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead className="thead-dark">
              <tr>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Codigo Patrimonial</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Descripción</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Trabajador</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Dependencia</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Ultima Fecha de Registro</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Alta</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Disposición</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Conservación</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Situación</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ACCION</th>
              </tr>
            </thead>
            <tbody>
              {stateData.map((item, index) => (
                <tr key={index}>
                  <td>{item.CODIGO_PATRIMONIAL}</td>
                  <td>{item.DESCRIPCION}</td>
                  <td>{item.TRABAJADOR}</td>
                  <td>{item.DEPENDENCIA}</td>
                  <td>{item.FECHA_REGISTRO ? new Date(item.FECHA_REGISTRO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}</td>
                  <td>{item.FECHA_ALTA ? item.FECHA_ALTA : 'No Registra'}</td>
                  <td>
                    {item.ESTADO === 0 ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>No Patrimonizado</span>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Patrimonizado</span>
                    )}
                  </td>
                  <td>
                    {item.DISPOSICION === 0 ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>No Funcional</span>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Funcional</span>
                    )}
                  </td>
                  {/* <td>{item.EST_CONSERVACION}</td> */}
                  <td
                    style={{
                      fontWeight: 'bold',
                      color:
                        item.EST_CONSERVACION === "Bueno"
                          ? "blue"
                          : item.EST_CONSERVACION === "Malo"
                            ? "#790303"
                            : item.EST_CONSERVACION === "Regular"
                              ? "purple"
                              : "black", // Color por defecto
                    }}
                  >
                    {item.EST_CONSERVACION}
                  </td>
                  <td>
                    {item.SITUACION === 0 ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>Faltante</span>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Verificado</span>
                    )}
                  </td>
                  <td>
                    {item.SITUACION === 0 ? (
                      <div className="btn-group d-flex flex-column gap-2" role="group">
                        <button
                          onClick={() => toggleDisposition(item.CODIGO_PATRIMONIAL, item.DISPOSICION)}
                          className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                        >
                          ⚙️ Cambiar Disposición
                        </button>
                        <button
                          onClick={() => toggleSituation(item.CODIGO_PATRIMONIAL, item.SITUACION)}
                          className="btn btn-primary bt-sm d-flex align-items-center gap-2"
                        >
                          📝 Cambiar Situación
                        </button>
                        <Link
                          to={`/edit/${item.CODIGO_PATRIMONIAL}`}
                          onClick={() => handleEdit(item)}
                          className="btn btn-primary bt-sm d-flex align-items-center gap-2"
                        >
                          ✏️ Editar
                        </Link>
                      </div>
                    ) : (
                      <div className="btn-group d-flex flex-column gap-2" role="group">
                        <button
                          onClick={() => toggleDisposition(item.CODIGO_PATRIMONIAL, item.DISPOSICION)}
                          className="btn btn-primary bt-sm d-flex align-items-center gap-2"
                        >
                          ⚙️ Cambiar Disposición
                        </button>
                        <button
                          onClick={() => toggleSituation(item.CODIGO_PATRIMONIAL, item.SITUACION)}
                          className="btn btn-primary bt-sm d-flex align-items-center gap-2"
                        >
                          📝 Cambiar Situación
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        stateCode && <p className="text-center text-danger">No se encontró información de estado del bien con el CODIGO PATRIMONIAL ingresado.</p>
      )}
    </div>
  )
}

export default CodeSearchMod2
