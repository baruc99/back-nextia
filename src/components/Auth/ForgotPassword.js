import React, { useState } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        try {
            await authService.forgotPassword(email, newPassword);
            setMessage('La contraseña se ha actualizado correctamente.');
            setIsSuccess(true);
            setEmail('');
            setNewPassword('');

            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            setMessage('No se pudo actualizar la contraseña. Inténtalo nuevamente.');
            setIsSuccess(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card shadow p-4" style={{ width: '400px' }}>
                <h2>Has olvidado tu contraseña</h2>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Ingrese correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicNewPassword" className="mt-3">
                        <Form.Label>Nueva contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingrese nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="primary" onClick={handleForgotPassword}>
                            Restablecer la contraseña
                        </Button>
                    </div>
                </Form>

                <div className="d-flex justify-content-center mt-3">
                    <Button variant="link" onClick={() => navigate('/login')}>
                        Volver al iniciar sesión
                    </Button>
                </div>
                {message && (
                    <Alert variant={isSuccess ? 'success' : 'danger'} className="mt-3">
                        {message}
                    </Alert>
                )}
            </div>
        </Container>
    );
};

export default ForgotPassword;

