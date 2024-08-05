import axios from 'axios';

// const API_URL = 'http://localhost:3002/api';
const API_URL = 'https://prueba-nextia.onrender.com/api';

const getInvitations = async () => {
    const response = await axios.get(`${API_URL}/invitations`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    // console.log( response.data['invitations'] );
    // return response.data;
    return response.data['invitations'];
};

const createInvitation = async (invitation) => {
    const response = await axios.post(`${API_URL}/invitations`, invitation, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

const deleteInvitation = async (id) => {
    const response = await axios.delete(`${API_URL}/invitations/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

const getInvitationById = async (id) => {
    const response = await axios.get(`${API_URL}/invitations/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

const updateInvitation = async (id, invitation) => {
    const response = await axios.put(`${API_URL}/invitations/${id}`, invitation, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};



const invitationService = {
    getInvitations,
    createInvitation,
    deleteInvitation,
    updateInvitation,
    getInvitationById
};

export default invitationService;
