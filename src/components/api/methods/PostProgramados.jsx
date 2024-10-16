import { useState } from 'react';
import axiosInstance from '../AxiosInstance';

const usePostProgramados = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const postProgramados = async (values) => {
        setLoading(true);
        console.log( 'teste:', values );
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

    return { rows, loading, error, postProgramados };
};

export default usePostProgramados;
