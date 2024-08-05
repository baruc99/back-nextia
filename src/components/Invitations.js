import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Pagination } from 'react-bootstrap';
import invitationService from '../services/invitationService';
import authService from '../services/authService';
import QRCode from 'qrcode.react';

const formatDate = (date) => {
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const d = new Date(date);
    const dayOfWeek = daysOfWeek[d.getDay()];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${dayOfWeek} ${day} de ${month} del ${year} a las ${hours}:${minutes}`;
};

const Invitations = () => {
    const [invitations, setInvitations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentInvitation, setCurrentInvitation] = useState(null);
    const [form, setForm] = useState({ guestName: '', entryDate: '', expirationDate: '' });
    const [validated, setValidated] = useState(false);


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        const data = await invitationService.getInvitations();
        setInvitations(Array.isArray(data) ? data : []);
    };

    const handleCreateInvitation = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const newInvitation = await invitationService.createInvitation({
                guestName: form.guestName.value,
                entryDate: form.entryDate.value,
                expirationDate: form.expirationDate.value,
            });
            const { invitation } = newInvitation;
            fetchInvitations();
            setShowModal(false);
            setCurrentInvitation(invitation);
            setShowQRModal(true);
        }
        setValidated(true);
    };

    const handleDeleteInvitation = async (id) => {
        await invitationService.deleteInvitation(id);
        fetchInvitations();
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setForm({ guestName: '', entryDate: '', expirationDate: '' });
        setValidated(false);
    };

    const openEditModal = async (id) => {
        const { invitation } = await invitationService.getInvitationById(id);

        setForm({
            guestName: invitation.guestName,
            entryDate: invitation.entryDate.slice(0, 16),
            expirationDate: invitation.expirationDate.slice(0, 16)
        });
        setCurrentInvitation(invitation);
        setShowEditModal(true);
    };

    const handleEditInvitation = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            await invitationService.updateInvitation(currentInvitation.id, {
                guestName: form.guestName.value,
                entryDate: form.entryDate.value,
                expirationDate: form.expirationDate.value,
            });
            fetchInvitations();
            setShowEditModal(false);
        }
        setValidated(true);
    };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = invitations.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleLogout = async () => {
        try {
            await authService.logout();
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <div className='d-flex justify-content-end'>
                        <Button className='mt-5' onClick={handleLogout}>Cerrar sesión</Button>
                    </div>
                </div>
            </div>
            <Button className='mb-5 mt-5' onClick={() => {
                resetForm();
                setShowModal(true);
            }}>Crear invitación</Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre del invitado</th>
                        <th>Fecha de entrada</th>
                        <th>Fecha de vencimiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((invitation) => (
                        <tr key={invitation.id}>
                            <td>{invitation.id}</td>
                            <td>{invitation.guestName}</td>
                            <td>{formatDate(invitation.entryDate)}</td>
                            <td>{formatDate(invitation.expirationDate)}</td>
                            <td>
                                <Button className='mx-3' variant="warning" onClick={() => openEditModal(invitation.id)}>Editar</Button>
                                <Button className='mx-3' variant="danger" onClick={() => handleDeleteInvitation(invitation.id)}>Borrar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
                {[...Array(Math.ceil(invitations.length / itemsPerPage)).keys()].map(number => (
                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                        {number + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear invitación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleCreateInvitation}>
                        <Form.Group controlId="guestName">
                            <Form.Label>Nombre del invitado</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="guestName"
                                value={form.guestName}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor proporcione un Nombre del invitado.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="entryDate">
                            <Form.Label>Fecha de entrada</Form.Label>
                            <Form.Control
                                required
                                type="datetime-local"
                                name="entryDate"
                                value={form.entryDate}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor proporcione una Fecha de entrada
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="expirationDate">
                            <Form.Label>Fecha de vencimiento</Form.Label>
                            <Form.Control
                                required
                                type="datetime-local"
                                name="expirationDate"
                                value={form.expirationDate}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor proporcione una Fecha de vencimiento.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className='d-flex justify-content-end mt-3'>
                            <Button className='mx-3' variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                            <Button className='mx-3' variant="primary" type="submit">Crear</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showQRModal} onHide={() => setShowQRModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Código QR de invitación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentInvitation && (
                        <div>
                            <div className='my-3' style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}>
                                <QRCode value={JSON.stringify(currentInvitation)} />
                            </div>
                            <p>Nombre del invitado: {currentInvitation.guestName}</p>
                            <p>Fecha de entrada: {formatDate(currentInvitation.entryDate)}</p>
                            <p>Fecha de vencimiento: {formatDate(currentInvitation.expirationDate)}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowQRModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar invitación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleEditInvitation}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}>
                            <QRCode value={JSON.stringify(form)} />
                        </div>
                        <Form.Group controlId="guestName">
                            <Form.Label>Nombre del invitado</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="guestName"
                                value={form.guestName}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor proporcione un Nombre del invitado.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="entryDate">
                            <Form.Label>Fecha de entrada</Form.Label>
                            <Form.Control
                                required
                                type="datetime-local"
                                name="entryDate"
                                value={form.entryDate}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor proporcione una Fecha de entrada.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="expirationDate">
                            <Form.Label>Fecha de vencimiento</Form.Label>
                            <Form.Control
                                required
                                type="datetime-local"
                                name="expirationDate"
                                value={form.expirationDate}
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor proporcione una Fecha de vencimiento.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className='d-flex justify-content-end mt-3'>
                            <Button className='mx-3' variant="secondary" onClick={() => setShowEditModal(false)}>Cerca</Button>
                            <Button className='mx-3' variant="primary" type="submit">Guardar cambios</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Invitations;
