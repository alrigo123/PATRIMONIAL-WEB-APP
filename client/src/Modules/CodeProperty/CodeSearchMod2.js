import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PopNotify from '../../AnimationComp/PopNotify';
import { Modal, Button } from 'react-bootstrap'; // Usamos react-bootstrap para el modal.

const URL = process.env.REACT_APP_API_URL_ITEMS

const CodeSearchMod2 = () => {
  const [stateCode, setStateCode] = useState('');
  const [stateData, setStateData] = useState([]);
  const stateInputRef = useRef(null);

  const [selectedItem, setSelectedItem] = useState(null); // Para guardar el item seleccionado
  const [modalVisible, setModalVisible] = useState(false); // Para controlar el modal
  const [newObservation, setNewObservation] = useState(''); // Para el contenido del textarea


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

  const handleEditObservation = (item) => {
    setSelectedItem(item);
    setNewObservation(item.OBSERVACION || ''); // Prellenar con la observación actual
    setModalVisible(true);
  };

  const saveObservation = async () => {
    try {
      // Llamada al endpoint con el código patrimonial
      await axios.put(`${URL}/observation/${selectedItem.CODIGO_PATRIMONIAL}`, {
        observacion: newObservation,
      });
      // Actualizar la tabla con la nueva observación
      setStateData((prev) =>
        prev.map((item) =>
          item.CODIGO_PATRIMONIAL === selectedItem.CODIGO_PATRIMONIAL
            ? { ...item, OBSERVACION: newObservation }
            : item
        )
      );
      setModalVisible(false); // Cerrar el modal
    } catch (error) {
      console.error('Error al guardar la observación:', error);
    }
  };

  return (
    <div>
      {/* Sección de búsqueda para estados */}
      <h5 className="text-lg-start fw-bold">CONSULTAR ESTADO DEL BIEN PATRIMONIAL</h5>
      <div className="row g-3">
        <div className="col-12 col-md-10">
          <input
            type="text"
            placeholder="Escanear código (barras) patrimonial"
            value={stateCode}
            onChange={handleStateInputChange}
            ref={stateInputRef}
            className="form-control mb-3 fw-bold"
            style={{ marginBottom: '20px', fontSize: '1.2rem', padding: '10px', border: "1px solid black" }}
            maxLength="12"
          />
        </div>
        <div className="col-12 col-md-2">
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
        <div className="table-responsive mt-3">
          {/* Mostrar icono solo en dispositivos móviles */}
          <PopNotify />
          <table className="table table-striped table-bordered align-middle small">
            <thead className="table-dark">
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
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Observacion</th>
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

                    <div className="btn-group d-flex flex-column gap-2" role="group">
                      {/* <button
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
                      </button> */}
                      <Link
                        to={`/edit/${item.CODIGO_PATRIMONIAL}`}
                        onClick={() => handleEdit(item)}
                        className="btn btn-primary bt-sm d-flex align-items-center gap-2"
                      >
                        ✏️ Editar
                      </Link>
                    </div>

                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: item.OBSERVACION ? 'bold' : 'normal',
                        fontStyle: item.OBSERVACION ? 'normal' : 'italic',
                        color: item.OBSERVACION ? '#000' : '#666', // Opcional: color diferenciado
                      }}
                    >
                      {item.OBSERVACION ? item.OBSERVACION : 'Sin observación'}
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      className='fw-bold'
                      onClick={() => handleEditObservation(item)}
                    >
                      📝 Añadir Observación
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Editar Observación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <textarea
                className="form-control"
                rows={5}
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalVisible(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={saveObservation}>
                Guardar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>


      ) : (
        stateCode && <p className="text-center text-danger fw-bold">No se encontró información del bien con el CODIGO PATRIMONIAL ingresado.</p>
      )}
    </div>
  )
}

export default CodeSearchMod2
