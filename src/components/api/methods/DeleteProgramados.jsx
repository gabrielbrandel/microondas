import { useState } from 'react';
import axiosInstance from '../AxiosInstance';

const useDeleteProgramados = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteProgramados = async (id) => {
        setLoading(true);
        try {
            await axiosInstance.delete(`programados/${id}`);
        } catch (error) {
            console.error('Erro ao comunicar com a API:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, deleteProgramados };
};

export default useDeleteProgramados;
