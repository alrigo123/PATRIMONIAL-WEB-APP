import React, { useState, useRef } from 'react';
import axios from 'axios';
import { parseDate } from '../../utils/datesUtils';
import { toast } from 'react-toastify';

const URL = process.env.REACT_APP_API_URL_ITEMS;

const CodeSearchMod1 = () => {
  const [barcode, setBarcode] = useState('');
  const [itemData, setItemData] = useState(null);

  const [searchType, setSearchType] = useState('TRABAJADOR'); // Select: TRABAJADOR o DEPENDENCIA
  const [selectedPerson, setSelectedPerson] = useState(null); // Estado para la selección
  const [personsList, setPersonsList] = useState([]); // Lista de sugerencias
  const [searchInput, setSearchInput] = useState(''); // Controla el input

  const inputRef = useRef(null);

  // Manejo de cambio en el select
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSelectedPerson(null); // Limpiar selección
    setSearchInput('');
    setPersonsList([]);
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

  // Buscar Trabajador o Dependencia según el select
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchInput(query);

    if (query.length > 2) {
      try {
        const endpoint =
          searchType === 'TRABAJADOR'
            ? `${URL}/partial/worker?search=${query}`
            : `${URL}/partial/dependency?search=${query}`; // Ruta específica
        const response = await axios.get(endpoint);
        setPersonsList(response.data);
      } catch (error) {
        console.log('Error en la búsqueda:', error);
      }
    }
  };

  const handleSelect = (person) => {
    setSelectedPerson(person);
    setPersonsList([]);
    setSearchInput(searchType === 'TRABAJADOR' ? person.TRABAJADOR : person.DEPENDENCIA);
  };

  const fetchItem = async (code) => {
    if (!selectedPerson) {
      alert('Primero debe seleccionar una persona o dependencia');
      return;
    }
    try {
      const params =
        searchType === 'TRABAJADOR'
          ? { trabajador_data: selectedPerson.TRABAJADOR }
          : { dependencia_data: selectedPerson.DEPENDENCIA }; // Parámetros dinámicos

      const response = await axios.get(`${URL}/${code}`, { params });

      if (response.status === 200) {
        toast.success('El bien patrimonial fue registrado correctamente', {
          position: 'top-center',
          autoClose: 1500,             // Tiempo de cierre automático
          hideProgressBar: false,
          closeOnClick: false,         // No cerrar con click
          pauseOnHover: false,         // No pausar al pasar el cursor
          pauseOnFocusLoss: false,     // No pausar al cambiar de ventana o pestaña
          draggable: true,
          progress: undefined,
        });
        setItemData(response.data);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          toast.error(`${data.message || 'El bien patrimonial no existe en la base de datos'}`, {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,         // No cerrar con click
            pauseOnHover: false,         // No pausar al pasar el cursor
            pauseOnFocusLoss: false,     // No pausar al cambiar de ventana o pestaña
            draggable: true,
            progress: undefined,
          });
        } else if (status === 400) {
          if (data.otroTrabajador) {
            const { TRABAJADOR, DEPENDENCIA, UBICACION } = data.otroTrabajador;
            toast.warning(
              <div>
                El bien patrimonial pertenece a: <strong>{TRABAJADOR}</strong>
                <br />
                Dependencia: <strong>{DEPENDENCIA}</strong>
              </div>,
              {
                position: 'top-center',
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: false,         // No cerrar con click
                pauseOnHover: false,         // No pausar al pasar el cursor
                pauseOnFocusLoss: false,     // No pausar al cambiar de ventana o pestaña
                draggable: true,
                progress: undefined,
              }
            );
          } else if (data.otraDependencia) {
            const { TRABAJADOR, DEPENDENCIA, UBICACION } = data.otraDependencia;
            toast.warning(
              <div>
                El bien patrimonial pertenece a dependencia: <strong>{DEPENDENCIA}</strong>
                <br />
                Trabajador: <strong>{TRABAJADOR}</strong>
              </div>,
              {
                position: 'top-center',
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: false,         // No cerrar con click
                pauseOnHover: false,         // No pausar al pasar el cursor
                pauseOnFocusLoss: false,     // No pausar al cambiar de ventana o pestaña
                draggable: true,
                progress: undefined,
              }
            );
          } else {
            toast.error(`${data.message || 'Error Inesperado'}`);
          }
        } else {
          alert(data.message || 'Ocurrió un error desconocido');
        }
      } else {
        console.error('Error de red o servidor:', error);
        toast.error('❌ No se pudo conectar con el servidor', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,         // No cerrar con click
          pauseOnHover: false,         // No pausar al pasar el cursor
          pauseOnFocusLoss: false,     // No pausar al cambiar de ventana o pestaña
          draggable: true,
          progress: undefined,
        });
      }
      setItemData(null); // Limpiar los datos del item si hubo un error
    }
  };

  const clearInput = () => {
    setBarcode('');
    setItemData(null);
    // setSelectedPerson(null);
    // setSearchInput('');
    inputRef.current.focus();
  };

  return (
    <div>
      <h5 className="text-lg-start fw-bold mb-3">REGISTRAR BIEN PATRIMONIAL</h5>
      <div className="row g-3">
        {/* Select para elegir entre Trabajador o Dependencia */}
        <div className="col-3">
          <select
            className="form-select fw-bold"
            value={searchType}
            onChange={handleSearchTypeChange}
            style={{ fontSize: '1.2rem', padding: '10px' }}
          >
            <option value="TRABAJADOR">Trabajador</option>
            <option value="DEPENDENCIA">Dependencia</option>
          </select>
        </div>

        {/* Input para buscar */}
        <div className="col-6">
          <input
            type="text"
            placeholder={`Buscar ${searchType}`}
            value={searchInput}
            onChange={handleSearch}
            className="form-control fw-bold"
            style={{ fontSize: '1.2rem', padding: '10px' }}
          />
          {personsList.length > 0 && (
            <ul className="list-group">
              {personsList.map((person) => (
                <li
                  key={person.id}
                  className="list-group-item"
                  onClick={() => handleSelect(person)}
                  style={{ cursor: 'pointer' }}
                >
                  {searchType === 'TRABAJADOR' ? person.TRABAJADOR : person.DEPENDENCIA}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Input de código patrimonial */}
        <div className="col-10">
          <input
            type="text"
            placeholder="Escanear código (barras) patrimonial"
            value={barcode}
            onChange={(e) => {
              const value = e.target.value;
              // Permitir solo dígitos y un máximo de 12 caracteres
              if (/^\d{0,12}$/.test(value)) {
                handleInputChange(e); // Actualizar el estado si pasa la validación
              }
            }}
            ref={inputRef}
            className="form-control mb-3 fw-bold"
            style={{ marginBottom: '20px', fontSize: '1.2rem', padding: '10px' }}
            disabled={!selectedPerson} // Deshabilitar si no se ha seleccionado una persona
            pattern="\d{12}" // Validar en el submit para asegurarse de que tiene exactamente 12 dígitos
            title="Debe contener exactamente 12 dígitos"
          />
        </div>

        {/* Botón de limpiar */}
        <div className="col-2">
          <button
            onClick={clearInput}
            className="btn btn-dark fw-bold"
            style={{ fontSize: '1.2rem', padding: '10px' }}
          >
            🧹 Limpiar
          </button>
        </div>
      </div>

      {/* Mostrar información del item */}
      {itemData && (
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
      )}
    </div>
  );
};

export default CodeSearchMod1;
