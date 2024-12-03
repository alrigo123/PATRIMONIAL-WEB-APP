import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const LoginModalComp = ({ show, handleClose }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);

  // Función para validar el formulario
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      // Aquí agregarías la lógica para la API más tarde
      alert("Formulario válido");
    }
    setValidated(true);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="text-center">
        <Modal.Title><span role="img" aria-label="login">🔒</span> Iniciar sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="formEmailOrUsername">
            <Form.Label><span role="img" aria-label="user">👤</span> Usuario o Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu usuario o correo electrónico"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              className="mb-3"
            />
            <Form.Control.Feedback type="invalid">
              Este campo es obligatorio.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label><span role="img" aria-label="password">🔑</span> Contraseña</Form.Label>
            <div className="d-flex mb-3">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 bg-red"
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </Button>
            </div>
            <Form.Control.Feedback type="invalid">
              Este campo es obligatorio.
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" block className="mb-3">
            <span role="img" aria-label="login">🚀</span> Iniciar sesión
          </Button>

          <div className="text-center">
            <p>¿No tienes cuenta? <a href="/user-register">Regístrate</a></p>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModalComp;
