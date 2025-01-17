import { useState } from 'react';
import axiosInstance from '../AxiosInstance';

const useGetProgramados = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProgramados = async (id) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`programados/${id}`);
            setRows(response.data); 
            return response.data;   
        } catch (error) {
            console.error('Erro ao comunicar com a API:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return { rows, loading, error, fetchProgramados };
};

export default useGetProgramados;
