import React, { useState, useRef } from 'react';
import axios from 'axios';
import { parseDate } from '../../utils/datesUtils';
import { toast } from 'react-toastify';

const URL = process.env.REACT_APP_API_URL_ITEMS;

const CodeSearchMod1 = () => {
  const [barcode, setBarcode] = useState('');
  const [itemData, setItemData] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null); // Estado para la persona o dependencia seleccionada
  const [personsList, setPersonsList] = useState([]); // Lista de sugerencias de personas o dependencias
  const [workerSearch, setWorkerSearch] = useState(''); // Para controlar lo que el usuario escribe en el input
  const inputRef = useRef(null);

  // Manejo de búsqueda de la persona o dependencia
  const handlePersonSearch = async (e) => {
    const worker_or_dependency = e.target.value;
    setWorkerSearch(worker_or_dependency); // Actualiza el valor del input mientras el usuario escribe
    if (worker_or_dependency.length > 2) {
      try {
        const response = await axios.get(`${URL}/partial?search=${worker_or_dependency}`);
        setPersonsList(response.data);
      } catch (error) {
        console.log('Error al buscar personas:', error);
      }
    }
  };

  const handlePersonSelect = (person) => {
    setSelectedPerson(person);
    setPersonsList([]); // Limpiar la lista de sugerencias
    setWorkerSearch(person.TRABAJADOR); // Poner el nombre de la persona seleccionada en el input
    // Agrega este console.log para ver la persona seleccionada
    console.log('Persona seleccionada:', person);
  };

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
    if (!selectedPerson) {
      alert('Primero debe seleccionar una persona o dependencia');
      return;
    }

    // Mostrar el nombre de la persona seleccionada en consola
    console.log('Trabajador seleccionado:', selectedPerson.TRABAJADOR);

    try {
      const response = await axios.get(`${URL}/${code}`, {
        params: {
          trabajador_data: selectedPerson.TRABAJADOR
        }
      });



      if (response.status === 200) {
        toast.success('✅ El código patrimonial fue actualizado correctamente', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setItemData(response.data);
      }

    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 404) {
          toast.error(`❌ ${data.message || 'El código patrimonial no existe en la base de datos'}`, {
            position: 'top-right',
            autoClose: 5000,
          });
        } else if (status === 400) {
          if (data.otroTrabajador) {
            const { TRABAJADOR, DEPENDENCIA, UBICACION } = data.otroTrabajador;
            toast.warning(
              `⚠️ El código patrimonial pertenece a otro trabajador: ${TRABAJADOR}. Dependencia: ${DEPENDENCIA}`,
              {
                position: 'top-right',
                autoClose: 7000,
              }
            );
          } else {
            toast.error(`❌ ${data.message || 'El código patrimonial no pertenece a este trabajador'}`, {
              position: 'top-right',
              autoClose: 5000,
            });
          }
        } else {
          alert(data.message || 'Ocurrió un error desconocido');
        }
      } else {
        console.error('Error de red o servidor:', error);
        toast.error('❌ No se pudo conectar con el servidor', {
          position: 'top-right',
          autoClose: 5000,
        });
      }

      setItemData(null); // Limpiar los datos del item si hubo un error
    }
  }


  //     if (response.data) {
  //       setItemData(response.data);
  //     } else {
  //       setItemData(null);
  //       alert('El item no pertenece a la persona o dependencia seleccionada');
  //     }
  //   } catch (error) {
  //     console.log('Error al obtener el item:', error);
  //     setItemData(null);
  //   }
  // };


  const clearInput = () => {
    setBarcode('');
    setItemData(null);
    // setSelectedPerson(null);
    // setWorkerSearch(''); // Limpiar la búsqueda de la persona también
    inputRef.current.focus();
  };

  return (
    <div>
      <h5 className="text-lg-start fw-bold">REGISTRAR BIEN PATRIMONIAL</h5>
      <div className="row g-3">
        {/* Input para seleccionar persona o dependencia */}
        <div className="col-10">
          <input
            type="text"
            placeholder="Buscar persona o dependencia"
            onChange={handlePersonSearch}
            value={workerSearch} // Controlar el input con el valor de workerSearch
            className="form-control mb-3 fw-bold"
            style={{ marginBottom: '20px', fontSize: '1.2rem', padding: '10px' }}
          />
          {personsList.length > 0 && (
            <ul className="list-group">
              {personsList.map((person) => (
                <li
                  key={person.id}
                  className="list-group-item"
                  onClick={() => handlePersonSelect(person)} // Seleccionar persona al hacer clic
                  style={{ cursor: 'pointer' }}
                >
                  {person.TRABAJADOR} - {person.DEPENDENCIA}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Input para buscar el código patrimonial */}
        <div className="col-10">
          <input
            type="text"
            placeholder="Escanear código (barras) patrimonial"
            value={barcode}
            onChange={handleInputChange}
            ref={inputRef}
            className="form-control mb-3 fw-bold"
            style={{ marginBottom: '20px', fontSize: '1.2rem', padding: '10px' }}
            disabled={!selectedPerson} // Deshabilitar si no se ha seleccionado una persona
          />
        </div>

        {/* Botón para limpiar el formulario */}
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

      {/* Mostrar información del item */}
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
              <p>
                {itemData.ESTADO === 0 ? (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Estado: <span style={{ color: 'red', fontWeight: 'bold' }}>❌ No Patrimonizado</span></h4>
                ) : (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Estado: <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Patrimonizado</span></h4>
                )}
              </p>
              <p>
                {itemData.DISPOSICION === 0 ? (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Disposición: <span style={{ color: 'red', fontWeight: 'bold' }}>❌ No Funcional</span></h4>
                ) : (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Disposición: <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Funcional</span></h4>
                )}
              </p>
              <p>
                {itemData.SITUACION === 0 ? (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Situación: <span style={{ color: 'red', fontWeight: 'bold' }}>❌ Faltante</span></h4>
                ) : (
                  <h4 style={{ color: 'black', marginBottom: '10px' }}>Situación: <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Verificado</span></h4>
                )}
              </p>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Fecha de Alta: <strong>{itemData.FECHA_ALTA || 'No Registra'}</strong></h4>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Fecha de Compra: <strong>{itemData.FECHA_COMPRA || 'No Registra'}</strong></h4>
              <h4 style={{ color: 'black', marginBottom: '10px' }}>Ultima Fecha de Registro: <strong>{itemData.FECHA_REGISTRO ? parseDate(itemData.FECHA_REGISTRO) : 'No Registrado'}</strong></h4>
            </div>
          </div>
        </div>
      ) : (
        barcode && <p className="text-center text-danger">No se encontró ningún bien con el CODIGO PATRIMONIAL ingresado.</p>
      )}
    </div>
  );
};

export default CodeSearchMod1;
