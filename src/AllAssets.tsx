import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from './config';
import { toast } from 'react-toastify';

const API: AxiosInstance = axios.create({ baseURL: BASE_URL })

const toastMessage = (type: string, message: string) => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'warning':
            toast.warn(message);
            break;
        case 'info':
            toast.info(message);
            break;
    }
}