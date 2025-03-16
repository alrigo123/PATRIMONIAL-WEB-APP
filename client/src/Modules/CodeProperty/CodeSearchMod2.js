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

  // Función que maneja los cambios en el input del código patrimonial
  const handleStateInputChange = (e) => {
    const value = e.target.value;

    // Validar que solo se ingresen números
    if (/^\d*$/.test(value)) {
      setStateCode(value);
      if (value.length === 12) {
        fetchState(value);
      }
    }
  };

  // Función para obtener el item de busqueda con la conservacion (endpoint /conservation)
  const fetchState = async (code) => {
    try {
      const response = await axios.get(`${URL}/conservation/${code}`);
      setStateData([response.data] || []);
    } catch (error) {
      console.log('Error al obtener el estado:', error);
      setStateData([]);
    }
  };

  // Función para limpiar el input de código y restablecer el estado
  const clearStateInput = () => {
    setStateCode('');
    setStateData([]);
    stateInputRef.current.focus();
  };

  // Función para manejar la edición de un código patrimonial
  const handleEdit = (item) => {
    if (!item.CODIGO_PATRIMONIAL) {
      // console.error('El CODIGO_PATRIMONIAL está indefinido:', item);
      return; // Evita seguir si no hay un código válido
    }
    // Lógica de edición
  };

  // Función para manejar la edición de la observación de un ítem
  const handleEditObservation = (item) => {
    setSelectedItem(item);
    setNewObservation(item.OBSERVACION || ''); // Prellenar con la observación actual
    setModalVisible(true);
  };

  // Función para guardar la nueva observación en la API y actualizar el estado
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
      {/* Muestra los datos en bucle de la consulta por id */}
      {stateData.length > 0 ? (
        <div className="table-responsive mt-3">
          {/* Mostrar icono solo en dispositivos móviles */}
          <PopNotify />
          <table className="table table-striped table-bordered align-middle small">
            <thead className="table-dark">
              <tr>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Codigo Patrimonial</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Descripción del bien</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Trabajador</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Dependencia</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Compra</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Fecha de Alta</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Ultima Fecha de Registro</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Estado</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Disposición</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Est. Conservación</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Acción</th>
                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Observación</th>
              </tr>
            </thead>
            <tbody>
              {stateData.map((item, index) => (
                <tr key={index}>
                  <td>{item.CODIGO_PATRIMONIAL}</td>
                  <td>{item.DESCRIPCION}</td>
                  <td>{item.TRABAJADOR}</td>
                  <td>{item.DEPENDENCIA}</td>
                  <td>{item.FECHA_COMPRA ? item.FECHA_COMPRA : 'No Registra'}</td>
                  <td>{item.FECHA_ALTA ? item.FECHA_ALTA : 'No Registra'}</td>
                  <td className='fw-bold'>{item.FECHA_REGISTRO ? new Date(item.FECHA_REGISTRO).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Sin registro'}</td>
                  <td>
                    {item.ESTADO === 0 ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>No Registrado</span>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Registrado</span>
                    )}
                  </td>
                  <td>
                    {item.DISPOSICION === 0 ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>de Baja</span>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Activo</span>
                    )}
                  </td>
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
                    <div className="btn-group d-flex flex-column gap-2" role="group">
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
