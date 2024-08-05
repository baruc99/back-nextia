import axios from 'axios';

// const API_URL = "http://localhost:3002/api";
const API_URL = "https://prueba-nextia.onrender.com/api";


const login = (email, password) => {
    return axios.post(`${API_URL}/users/token`, { email, password });
};

const register = (firstName, lastName, email, password, departmentNumber) => {
    console.log({
        firstName,
        lastName,
        email,
        password,
        "apartmentNumber": departmentNumber
    });
    return axios.post(`${API_URL}/users/signup`, {
        firstName,
        lastName,
        email,
        password,
        "apartmentNumber": departmentNumber
    });
};


const forgotPassword = async (email, newPassword) => {
    try {
        await axios.post(`${API_URL}/users/recover`, { email, newPassword });
    } catch (error) {
        throw new Error('Failed to send password reset link.');
    }
};

const logout = () => {
    return axios.post(`${API_URL}/users/logout`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
};

// TODO: checar auth0

const authService = {
    login,
    register,
    forgotPassword,
    logout
};

export default authService;