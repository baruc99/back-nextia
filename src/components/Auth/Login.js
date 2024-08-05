
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import authService from '../../services/authService';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await authService.login(email, password);
            localStorage.setItem('token', data.token);
            navigate('/invitations');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card shadow p-4" style={{ width: '400px' }}>
                <h2 className="mb-4">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Correo electronico</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Introduce tu correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="password" className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100">
                        Entrar
                    </Button>
                </Form>
                <div className="d-flex justify-content-between mt-3">
                    <Button variant="link" onClick={() => navigate('/register')}>
                        Registrar
                    </Button>
                    <Button variant="link" onClick={() => navigate('/forgot-password')}>
                        ¿Has olvidado tu contraseña?
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Login;
