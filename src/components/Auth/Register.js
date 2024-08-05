import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import authService from '../../services/authService';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [departmentNumber, setDepartmentNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await authService.register(firstName, lastName, email, password, departmentNumber);
            setSuccess('¡Registro exitoso! \n Redireccionando al inicio de sesión...');

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError('Error en el registro. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card shadow p-4" style={{ width: '400px' }}>
                <h2>Registro</h2>
                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="firstName">Nombre(s)</Form.Label>
                        <Form.Control
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="lastName">Apellidos</Form.Label>
                        <Form.Control
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="email">Correo electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="password">Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="departmentNumber">Número de departamento</Form.Label>
                        <Form.Control
                            type="text"
                            id="departmentNumber"
                            value={departmentNumber}
                            onChange={(e) => setDepartmentNumber(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="primary" type="submit">
                            Registrar
                        </Button>
                    </div>
                </Form>
                <div className="d-flex justify-content-center mt-3">
                    <Button variant="link" onClick={() => navigate('/login')}>
                        volver a  inicio de sesión
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Register;
