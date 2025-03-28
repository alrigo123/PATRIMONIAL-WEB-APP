import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import axios from 'axios';

const LoginModalComp = ({ show, handleClose, onLoginSuccess }) => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const URL = process.env.REACT_APP_API_URL_USER;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!dni || !password) {
      setErrorMessage('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(`${URL}/login`, { dni, password });

      // Si el login es exitoso, guardar el token en el localStorage
      localStorage.setItem('token', response.data.token); // Store token of login
      localStorage.setItem('user', JSON.stringify(response.data.user.name_and_last)); // Store the NAME AND LAST NAME of the USER linked to the token

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión correcta",
          showConfirmButton: false,
          timer: 1000
        });

        // Llama a la función para notificar éxito y cerrar el modal
        if (onLoginSuccess) {
          onLoginSuccess();
        }

        // Limpiar mensajes de error antes de cerrar
        setErrorMessage('');
        handleClose();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error al iniciar sesión.';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className='fw-bold'>🔒 Iniciar sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger" aria-live="assertive">{errorMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formDni">
            <Form.Label>👤 DNI</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu DNI"
              value={dni}
              className='mb-2'
              onChange={(e) => setDni(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">Por favor ingresa tu DNI.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formPassword" >
            <Form.Label className='mt-2'>🔑 Contraseña</Form.Label>
            <div className="d-flex mb-4">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </Button>
            </div>
            <Form.Control.Feedback type="invalid">Por favor ingresa tu contraseña.</Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" block disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" aria-label="Cargando..." /> : '🚀 Iniciar sesión'}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <p>¿No tienes cuenta? <a href="/inventory/user-register">Regístrate</a></p>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModalComp;
