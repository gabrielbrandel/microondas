import { useState } from 'react';
import axiosInstance from '../AxiosInstance';

const usePostProgramados = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const PostProgramados = async (values) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('programados', values);
            setRows(response.data); 
            return response.data;   
        } catch (error) {
            console.error('Erro ao comunicar com a API:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return { rows, loading, error, PostProgramados };
};

export default usePostProgramados;
