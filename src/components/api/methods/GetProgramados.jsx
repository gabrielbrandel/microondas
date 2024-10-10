import { useState } from 'react';
import axiosInstance from '../AxiosInstance';

const useFetchProgramados = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // A função `fetchProgramados` agora retorna os dados
    const fetchProgramados = async (id) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`programados/${id}`);
            setRows(response.data); // Atualiza o estado `rows`
            return response.data; // Retorna os dados diretamente
        } catch (error) {
            console.error('Erro ao comunicar com a API:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return { rows, loading, error, fetchProgramados };
};

export default useFetchProgramados;
