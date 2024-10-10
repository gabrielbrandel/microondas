import { useState } from 'react';
import axiosInstance from '../AxiosInstance';

const usePutProgramados = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const PutProgramados = async (id, values) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(`programados/${id}`, values);
            const updatedRows = rows.map(item =>
                item.id === id ? { ...item, ...values } : item
            );

            setRows(updatedRows); 
            return response.data; 

        } catch (error) {
            console.error('Erro ao comunicar com a API:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return { rows, loading, error, PutProgramados };
};

export default usePutProgramados;
